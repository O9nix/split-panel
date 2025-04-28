# Split Panel Layout System

Гибкая система для создания и управления разбиваемыми панелями с возможностью рекурсивного разделения и изменения размеров.

## Особенности

- **Рекурсивное разделение** - любой блок можно разделить горизонтально или вертикально
- **Изменение размеров** - интерактивное изменение размеров панелей
- **Контекстное меню** - удобное управление через правый клик
- **Удаление панелей** - возможность удалять ненужные блоки
- **Адаптивная структура** - автоматическая корректировка размеров при изменениях

## Установка

Просто подключите HTML и CSS файлы в ваш проект:

```html
<link rel="stylesheet" href="split-panel.css">
<script src="split-panel.js"></script>
```
А так же добавьте html блок:
```html
 <div id="container">
    <div class="block" style="background-color: #3498db;">
      <span class="block-id">Блок 1</span>
      Основное содержимое
    </div>
  </div>

  <div class="context-menu" id="contextMenu">
    <button data-action="split-h">Разделить горизонтально</button>
    <button data-action="split-v">Разделить вертикально</button>
    <button data-action="remove">Удалить блок</button>
  </div>
```
