<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div style="display: flex; align-items: center;">
          <h5>积分记录</h5>
          <h5>（当前积分：{{ totalPoint }}）</h5>
        </div>
        <div style="display: flex; align-items: center;">
          <el-button v-if="!hasApplyExtraPoint" round @click="openDialog">获取今日补偿积分</el-button>
          <el-button class="add-btn" type="primary" round @click="handleExchange">兑换活动</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <el-table :data="tableList" row-key="id">
          <el-table-column type="index" label="序号" min-width="60" />
          <el-table-column prop="eventName" label="记录内容" min-width="150" />
          <el-table-column prop="score" label="分值" min-width="80">
            <template #default="scope">
              {{ `${scope.row.score > 0 ? '+' : ''}${scope.row.score}` }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="完成时间" min-width="180" :formatter="formatter" />
          <el-table-column prop="type" label="积分类型" min-width="100">
            <template #default="scope">
              {{ PointEventTypeLabel[scope.row.eventType] ?? '--' }}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
  <el-dialog v-model="showDialog" modal-class="extra-point-dialog" :title="extraPointInfo.dialogTitle">
    <div style="margin-top: -23px; padding-top: 18px; padding-left: 10px; border-top: 1px solid #f2f3f5;" />
    <el-table :data="ExtraPointTableData">
      <el-table-column property="levelName" label="档数" width="80" />
      <el-table-column property="workdayScore" label="工作日所需分值（分）" align="center" min-width="150">
        <template #default="scope">
          <span :style="getCellStyle(scope.row, DateType.Workday)">{{ scope.row.workdayScore }}</span>
        </template>
      </el-table-column>
      <el-table-column property="weekdayScore" label="休息日所需分值（分）" align="center" min-width="150">
        <template #default="scope">
          <span :style="getCellStyle(scope.row, DateType.Weekday)">{{ scope.row.weekdayScore }}</span>
        </template>
      </el-table-column>
      <el-table-column property="pointStandard" label="补偿分值（分）" align="center" min-width="150">
        <template #default="scope">
          <span :style="getCellStyle(scope.row)">{{ getScoreCellText(scope.row, scope.row.pointStandard) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 15px;">若每日累计积分达到某一档时，则可获取今日额外补偿积分。各档条件如上</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">{{ extraPointInfo.level === ExtraPointLevel.NoLevel ? '我知道了' : '再等等'
        }}</el-button>
        <el-popconfirm v-if="extraPointInfo.level !== ExtraPointLevel.NoLevel" :title="extraPointInfo.tip" @confirm="addExtraPoint">
          <template #reference>
            <el-button type="primary">现在获取</el-button>
          </template>
        </el-popconfirm>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElMessage, dayjs } from 'element-plus';
import ww from 'chinese-workday';
import { useRouter } from 'vue-router';
import { getPointList } from './serve';
import { addPoint } from '../todoConfig/serve'
import { PointEventTypeLabel, PointEventTypeMap } from '../../constant';
import { ExtraPointTableData, DateType, DateTypePointStandard, ExtraPointLevel, ExtraPointLevelScore } from './constant';

const router = useRouter();

const showDialog = ref(false);
const totalPoint = ref(0);
const tableList = ref([]);
const todayPoint = ref(0);
const extraPointInfo = ref({});
const hasApplyExtraPoint = ref(false);

onMounted(() => {
  getData();
})

const getData = async () => {
  const { data, total } = await getPointList();
  tableList.value = formatData(data);
  totalPoint.value = total;
}

const formatData = (data) => {
  const newDataMap = {};
  const today = dayjs().format('YYYY-MM-DD');
  for (let i = 0; i < data.length; i++) {
    const { createTime, score, eventType } = data[i];
    const date = dayjs(createTime).format('YYYY-MM-DD');
    // 初始化今日是否获取过补偿积分
    if (eventType === PointEventTypeMap.ExtraPoint && date === today) {
      hasApplyExtraPoint.value = true;
    }
    if (newDataMap[date]) {
      const parentItem = newDataMap[date];
      parentItem.score += score;
      parentItem.createTime = Math.max(parentItem.createTime, createTime);
      parentItem.children.push(data[i]);
    } else {
      newDataMap[date] = {
        id: dayjs(createTime).format('YYYYMMDD'),
        eventName: `${dayjs(createTime).format('YYYY年MM月DD日')} 所得积分`,
        score,
        createTime,
        eventType: -1,
        children: [data[i]]
      }
    }
  }
  todayPoint.value = newDataMap[dayjs().format('YYYY-MM-DD')]?.score ?? 0;
  const newData = Object.keys(newDataMap).map((key) => newDataMap[key]);
  return newData.sort((a, b) => b.id - a.id);
}

const initExtraPointInfo = () => {
  const weekNum = dayjs().format('YYYY-MM-DD');
  const isWorkday = ww.isWorkday(weekNum);
  const dateType = isWorkday ? DateType.Workday : DateType.Weekday;
  const scoreMap = DateTypePointStandard[dateType];
  let dialogTitle = `今日已累计${todayPoint.value}分，`;
  let level = ExtraPointLevel.NoLevel;
  let tip = '';
  if (todayPoint.value < scoreMap[ExtraPointLevel.First]) {
    dialogTitle += `尚未达到任意档，无补偿积分`;
    tip = `距离下一档还需${scoreMap[ExtraPointLevel.First] - todayPoint.value}分，继续努力哦。`
  } else if (todayPoint.value < scoreMap[ExtraPointLevel.Second]) {
    level = ExtraPointLevel.First;
    dialogTitle += `满足第${level}档，可得${ExtraPointLevelScore[level]}分`;
    tip = `距离下一档还需${scoreMap[ExtraPointLevel.Second] - todayPoint.value}分，是否现在就获取？（每日仅可获取一次）`;
  } else if (todayPoint.value < scoreMap[ExtraPointLevel.Third]) {
    level = ExtraPointLevel.Second;
    dialogTitle += `满足第${level}档，可得${ExtraPointLevelScore[level]}分`;
    tip = `距离下一档还需${scoreMap[ExtraPointLevel.Third] - todayPoint.value}分，是否现在就获取？（每日仅可获取一次）`;
  } else {
    level = ExtraPointLevel.Third;
    dialogTitle += `满足最高档，可得${ExtraPointLevelScore[level]}分，再忙也要劳逸结合哦！`;
  }
  extraPointInfo.value = {
    dateType,
    level,
    dialogTitle,
    tip
  }
}

const openDialog = () => {
  showDialog.value = true;
  initExtraPointInfo();
}

const getCellStyle = (row, dateType) => {
  if (dateType && dateType !== extraPointInfo.value.dateType) return '';
  const { level } = row;
  if (level === extraPointInfo.value.level) {
    return 'color: green';
  }
  if (level === extraPointInfo.value.level + 1) {
    return 'color: #FF7034';
  }
}

const getScoreCellText = (row, value) => {
  const { level } = row;
  if (level === extraPointInfo.value.level) {
    return `${value} (当前可得)`;
  }
  if (level === extraPointInfo.value.level + 1) {
    return `${value} (下一档可得)`;
  }
  return value;
}

const addExtraPoint = async () => {
  const { level } = extraPointInfo.value;
  const score = ExtraPointLevelScore[level];
  const pointInfo = {
    eventType: PointEventTypeMap.ExtraPoint,
    score,
    createTime: Date.now()
  }
  await addPoint(pointInfo);
  hasApplyExtraPoint.value = true;
  ElMessage.success('已获得今日补偿积分');
  showDialog.value = false;
  getData();
}

const formatter = (row) => {
  return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss');
}

const handleExchange = () => {
  router.push({
    path: '/exchangePoint',
    query: {
      point: totalPoint.value
    }
  })
};

</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  border-bottom: 1px solid #dcdfe6;
}

.extra-point-dialog {
  padding-top: 0;
}

.common-layout {
  :deep(.el-table .cell) {
    white-space: pre-line;
  }
}
</style>
