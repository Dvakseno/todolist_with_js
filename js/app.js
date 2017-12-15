const main = (() => {
  function createElement(tag, props, ...children) {
    const element = document.createElement(tag);

    const forId = Math.floor(+new Date() / 1000);
    if (tag === 'label') element.setAttribute('for', forId);

    Object.keys(props).forEach(key => {
      element[key] = props[key];
      if (props[key] === 'checkbox') element.setAttribute('id', forId);
    });

    if (children.length > 0) {
      children.forEach(child => {
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }
        element.appendChild(child);
      });
    }

    return element;
  }

  function createTodoItem(title, description, id, completed) {
    const checkbox = createElement('input', { type: 'checkbox', className: 'todo-item-checkbox' });
    const label = createElement('label', { className: 'todo-item-label' }, title);
    if (id) {
      checkbox.id = id;
      label.setAttribute('for', id);
    }
    if (completed) {
      checkbox.setAttribute('checked', 'checked');
    }
    const listItemLabelChange = createElement('input', {
      type: 'text',
      className: 'todo-item-label-change'
    });
    const listItemTitle = createElement(
      'div',
      { className: 'todo-item-title' },
      checkbox,
      label,
      listItemLabelChange
    );

    const listItemDescription = createElement(
      'div',
      { className: 'todo-item-description' },
      description
    );

    const listItemDescriptionChange = createElement('textarea', {
      className: 'todo-item-description-change'
    });

    const todoButtonEdit = createElement('button', { className: 'todo-btn todo-edit' }, 'Edit');
    const todoButtonDelete = createElement(
      'button',
      { className: 'todo-btn todo-delete' },
      'Delete'
    );
    const todoButtons = createElement(
      'div',
      { className: 'todo-btns' },
      todoButtonEdit,
      todoButtonDelete
    );

    const listItem = createElement(
      'li',
      { className: 'todo-item' },
      listItemTitle,
      listItemDescription,
      listItemDescriptionChange,
      todoButtons
    );
    if (completed) listItem.classList.add('todo-item-completed');

    bindEvents(listItem);

    const idItem = checkbox.id;

    addToStorage(title, description, idItem, completed);

    return listItem;
  }

  function bindEvents(listItem) {
    const checkbox = listItem.querySelector('.todo-item-checkbox');
    const editButton = listItem.querySelector('.todo-edit');
    const deleteButton = listItem.querySelector('.todo-delete');

    checkbox.addEventListener('change', toggleToComplete);
    editButton.addEventListener('click', editTodoItem);
    deleteButton.addEventListener('click', deleteTodoItem);
  }

  function toggleToComplete() {
    const listItem = this.parentNode.parentNode;
    const editButton = listItem.querySelector('.todo-edit');
    const deleteButton = listItem.querySelector('.todo-delete');
    listItem.classList.toggle('todo-item-completed');
    const isCompleted = listItem.classList.contains('todo-item-completed');
    if (isCompleted) {
      editButton.setAttribute('disabled', 'disabled');
    } else {
      editButton.removeAttribute('disabled');
    }

    const checkbox = listItem.querySelector('.todo-item-checkbox');
    const listId = checkbox.id;
    data.forEach((item, i) => {
      if (item.id === listId) {
        localStorage.removeItem('listWiley');
        if (isCompleted) {
          item.completed = true;
        } else {
          item.completed = false;
        }
        save(data);
      }
    });
  }

  function editTodoItem() {
    const listItem = this.parentNode.parentNode;
    const title = document.querySelector('.todo-item-label');
    const titleEdit = document.querySelector('.todo-item-label-change');
    const description = document.querySelector('.todo-item-description');
    const descriptionEdit = document.querySelector('.todo-item-description-change');
    const isEditing = listItem.classList.contains('editing');

    if (isEditing) {
      title.textContent = titleEdit.value;
      description.textContent = descriptionEdit.value;
      this.textContent = 'Edit';
    } else {
      titleEdit.value = title.textContent;
      descriptionEdit.value = description.textContent;
      this.textContent = 'Save';
    }

    listItem.classList.toggle('editing');

    const checkbox = listItem.querySelector('.todo-item-checkbox');
    const listId = checkbox.id;

    data.forEach((item, i) => {
      if (item.id === listId) {
        localStorage.removeItem('listWiley');
        item.title = title.textContent;
        item.description = description.textContent;
        save(data);
      }
    });
  }

  function deleteTodoItem() {
    const listItem = this.parentNode.parentNode;
    list.removeChild(listItem);

    const checkbox = listItem.querySelector('.todo-item-checkbox');
    const listId = checkbox.id;

    data.forEach((item, i) => {
      if (item.id === listId) {
        localStorage.removeItem('listWiley');
        data.splice(i, 1);
        save(data);
      }
    });
  }

  function addTodoItem(e) {
    e.preventDefault();
    if (!addTitle.value) return alert('Enter the title!');
    const listItem = createTodoItem(addTitle.value, addDescription.value);
    list.appendChild(listItem);

    addTitle.value = '';
    addDescription.value = '';
  }

  function addToStorage(title, description, id, completed) {
    const dataItem = {
      id,
      title,
      description,
      completed
    };
    data.push(dataItem);
    save(data);
  }

  function load() {
    const data = JSON.parse(localStorage.getItem('listWiley'));
    return data;
  }
  function save(data) {
    const string = JSON.stringify(data);
    localStorage.setItem('listWiley', string);
  }

  const list = document.querySelector('.todo-list');
  const form = document.querySelector('.todo-form');
  const addTitle = document.querySelector('.todo-add-title');
  const addDescription = document.querySelector('.todo-add-subject');
  const addButton = document.querySelector('.todo-add-btn');

  const data = [];

  function main() {
    form.addEventListener('submit', addTodoItem);
  }

  function restore(load) {
    if (load) {
      load.forEach(function(item) {
        const id = item.id;
        const title = item.title;
        const description = item.description;
        const completed = item.completed;
        const listItem = createTodoItem(title, description, id, completed);
        list.appendChild(listItem);
      });
    }
  }

  restore(load());

  return main;
})();

main();
