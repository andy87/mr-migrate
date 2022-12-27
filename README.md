# mrMigrate
service migrate generator

Добавить базу данных.
```javascript
mrMigrate.create.db('database');
```
Добвить в базу данны таблицу.
```javascript
mrMigrate.db.database.addTable('table_1');
```

Создание таблицы и поля в таблице, при создании таблицы
```javascript
mrMigrate.get.db('database').createTable('table_1').addField('Field_1--table_1', mrMigrate.TYPE_STRING);
```
Создание таблицы и поля в таблице, при создании таблицы
```javascript
mrMigrate.get.db('database').getTable('table_1').addField('Field_2--table_1', mrMigrate.TYPE_DATE);
```
Получение базы
```javascript
let database = mrMigrate.get.db('database');
```
Создание таблицы и полячерез получение базы
```javascript
database.createTable('table_2').addField('Field_3--table_2', mrMigrate.TYPE_STRING);
```
Получение таблицы
```javascript
let table = database.getTable('table_2');
```
создание поля через получение таблицы
```javascript
table.addField('Field_4--table_2', mrMigrate.TYPE_PRIMARY_KEY);
```