const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#d35400'];
let blockCounter = 1;
let currentBlock = null;
const contextMenu = document.getElementById('contextMenu');

document.addEventListener('contextmenu', function(event) {
  const block = event.target.closest('.block');
  if (!block) return;
  
  event.preventDefault();
  currentBlock = block;
  
  // Позиционируем меню
  contextMenu.style.display = 'block';
  contextMenu.style.left = `${event.clientX}px`;
  contextMenu.style.top = `${event.clientY}px`;
});

// Закрываем меню при клике вне его
document.addEventListener('click', function(event) {
  if (!contextMenu.contains(event.target)) {
    contextMenu.style.display = 'none';
  }
});

// Обработка выбора в меню
contextMenu.addEventListener('click', function(event) {
  const button = event.target.closest('button');
  if (!button || !currentBlock) return;
  
  const action = button.dataset.action;
  
  switch(action) {
    case 'split-h':
      splitBlock(currentBlock, false);
      break;
    case 'split-v':
      splitBlock(currentBlock, true);
      break;
    case 'remove':
      removeBlock(currentBlock);
      break;
  }
  
  contextMenu.style.display = 'none';
});

document.addEventListener('mousedown', function(event) {
  if (event.target.classList.contains('resizer') || 
      event.target.classList.contains('vertical-resizer')) {
    startResize(event);
  }
});

function splitBlock(block, isVerticalSplit) {
  // Сохраняем текущий блок (он станет первым в разделённой паре)
  const originalBlock = block;
  
  // Создаём новый блок
  const newBlock = document.createElement('div');
  newBlock.className = 'block';
  newBlock.innerHTML = `<span class="block-id">Блок ${++blockCounter}</span>Новый блок`;
  newBlock.style.backgroundColor = colors[blockCounter % colors.length];
  
  // Создаём разделитель
  const resizer = document.createElement('div');
  resizer.className = isVerticalSplit ? 'vertical-resizer' : 'resizer';
  
  // Создаём контейнер для разделения
  const splitContainer = document.createElement('div');
  splitContainer.className = `split-container ${isVerticalSplit ? 'vertical' : ''}`;
  
  // Заменяем оригинальный блок контейнером
  block.parentNode.replaceChild(splitContainer, block);
  
  // Добавляем блоки в контейнер
  splitContainer.appendChild(originalBlock);
  splitContainer.appendChild(resizer);
  splitContainer.appendChild(newBlock);
  
  // Устанавливаем начальные размеры
  if (isVerticalSplit) {
    originalBlock.style.height = '50%';
    newBlock.style.height = '50%';
    originalBlock.style.width = '100%';
    newBlock.style.width = '100%';
  } else {
    originalBlock.style.height = '100%';
    newBlock.style.height = '100%';
    originalBlock.style.width = '50%';
    newBlock.style.width = '50%';
  }
}

function removeBlock(block) {
const parent = block.parentElement;

// Если это корневой блок - не удаляем
if (parent.id === 'container' && parent.children.length === 1) {
alert('Нельзя удалить последний оставшийся блок!');
return;
}

// Если родитель - контейнер с разделителем
if (parent.classList.contains('split-container')) {
// Находим все блоки и разделители в контейнере
const children = Array.from(parent.children);
const blocks = children.filter(el => el.classList.contains('block'));
const resizers = children.filter(el => 
  el.classList.contains('resizer') || el.classList.contains('vertical-resizer'));

// Если остался только один блок после удаления
if (blocks.length === 2) {
  const siblingBlock = blocks.find(b => b !== block);
  
  // Заменяем контейнер на оставшийся блок
  if (parent.parentElement) {
    parent.parentElement.replaceChild(siblingBlock, parent);
  }
} else {
  // Если блоков больше, просто удаляем нужный блок и его разделитель
  const blockIndex = children.indexOf(block);
  let resizerToRemove = null;

  
  // Определяем какой разделитель удалять (предыдущий или следующий)
  if (blockIndex > 0 && (children[blockIndex-1].classList.contains('resizer') || 
      children[blockIndex-1].classList.contains('vertical-resizer'))) {
    resizerToRemove = children[blockIndex-1];
  } else if (blockIndex < children.length-1 && 
             (children[blockIndex+1].classList.contains('resizer') || 
              children[blockIndex+1].classList.contains('vertical-resizer'))) {
    resizerToRemove = children[blockIndex+1];
  }
  
  // Удаляем блок и разделитель
  if (resizerToRemove) parent.removeChild(resizerToRemove);
  parent.removeChild(block);
  
  // Если в контейнере остался только один блок, упрощаем структуру
  if (parent.children.length === 1 && parent.parentElement) {
    parent.parentElement.replaceChild(parent.children[0], parent);
  }
}
}
}

let currentResizer = null;
let startX, startY, startWidth, startHeight;

function startResize(event) {
  currentResizer = event.target;
  const splitContainer = currentResizer.parentElement;
  const isVertical = splitContainer.classList.contains('vertical');
  
  if (isVertical) {
    startY = event.clientY;
    startHeight = parseInt(document.defaultView.getComputedStyle(splitContainer.children[0]).height, 10);
  } else {
    startX = event.clientX;
    startWidth = parseInt(document.defaultView.getComputedStyle(splitContainer.children[0]).width, 10);
  }
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', stopResize);
}

function handleMouseMove(event) {
  if (!currentResizer) return;
  
  const splitContainer = currentResizer.parentElement;
  const isVertical = splitContainer.classList.contains('vertical');
  const firstBlock = splitContainer.children[0];
  const secondBlock = splitContainer.children[2];
  
  if (isVertical) {
    const dy = event.clientY - startY;
    const containerHeight = splitContainer.offsetHeight;
    let newHeight = startHeight + dy;
    
    // Ограничиваем минимальный размер
    newHeight = Math.max(newHeight, 50);
    newHeight = Math.min(newHeight, containerHeight - 50);
    
    firstBlock.style.height = `${newHeight}px`;
    secondBlock.style.height = `${containerHeight - newHeight - 10}px`;
  } else {
    const dx = event.clientX - startX;
    const containerWidth = splitContainer.offsetWidth;
    let newWidth = startWidth + dx;
    
    // Ограничиваем минимальный размер
    newWidth = Math.max(newWidth, 50);
    newWidth = Math.min(newWidth, containerWidth - 50);
    
    firstBlock.style.width = `${newWidth}px`;
    secondBlock.style.width = `${containerWidth - newWidth - 10}px`;
  }
}

function stopResize() {
  currentResizer = null;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResize);
}