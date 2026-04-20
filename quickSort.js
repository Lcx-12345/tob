// 快速排序算法实现
function quickSort(arr) {
  // 基本情况：如果数组长度小于等于1，已经排序完成
  if (arr.length <= 1) {
    return arr;
  }
  
  // 选择基准元素（这里选择中间元素）
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];
  
  // 分治：将数组分为小于、等于和大于基准的三部分
  const left = [];
  const middle = [];
  const right = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (i === pivotIndex) continue; // 跳过基准元素
    
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else if (arr[i] > pivot) {
      right.push(arr[i]);
    } else {
      middle.push(arr[i]);
    }
  }
  
  // 递归排序左右两部分，然后合并结果
  return [...quickSort(left), pivot, ...middle, ...quickSort(right)];
}

// 测试示例
const testArray = [3, 6, 8, 10, 1, 2, 1];
console.log('原始数组:', testArray);
const sortedArray = quickSort(testArray);
console.log('排序后数组:', sortedArray);

// 另一种实现方式（原地排序，空间复杂度更低）
function quickSortInPlace(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // 获取分区点
    const pivotIndex = partition(arr, low, high);
    
    // 递归排序左右两部分
    quickSortInPlace(arr, low, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  // 选择最右边的元素作为基准
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      // 交换元素
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // 将基准元素放到正确的位置
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// 测试原地排序
const testArray2 = [3, 6, 8, 10, 1, 2, 1];
console.log('\n原地排序 - 原始数组:', testArray2);
quickSortInPlace(testArray2);
console.log('原地排序 - 排序后数组:', testArray2);