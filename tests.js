
window.addEventListener('load', function (){

    console.log('autotests `mrMigrate`');

    mrMigrate.create.db('database');

    mrMigrate.db.database.addTable('table_1');

    mrMigrate.get.db('database').createTable('table_1').addField('Field_1--table_1', mrMigrate.TYPE_STRING);
    mrMigrate.get.db('database').getTable('table_1').addField('Field_2--table_1', mrMigrate.TYPE_STRING);

    let database = mrMigrate.get.db('database');

    database.createTable('table_2').addField('Field_3--table_2', mrMigrate.TYPE_STRING);

    let table = database.getTable('table_2');

    table.addField('Field_4--table_2', mrMigrate.TYPE_STRING);

    console.log(mrMigrate.db);
});