"use strict";

/**
 * @author Kidin and_y87 Andrey
 */

let mrMigrate = {};

(function()
{
    const
        DB = 'db',
        TABLE = 'table',
        FIELD = 'field',

        TYPE_PRIMARY_KEY = '_primaryKey',
        TYPE_CREATED = '_created',
        TYPE_UPDATED = '_updated',
        TYPE_DATE = 'date',
        TYPE_DATETIME = 'date_time',
        TYPE_INT = 'int',
        TYPE_STRING = 'string';


    let _ = mrMigrate = {
        DB : DB,
        TABLE : TABLE,
        FIELD : FIELD,

        TYPE_PRIMARY_KEY : TYPE_PRIMARY_KEY,
        TYPE_CREATED : TYPE_CREATED,
        TYPE_UPDATED : TYPE_UPDATED,
        TYPE_DATE : TYPE_DATE,
        TYPE_DATETIME : TYPE_DATETIME,
        TYPE_INT : TYPE_INT,
        TYPE_STRING : TYPE_STRING,

        db: {},

        get : {
            db : function (name){
                return _.db[name];
            },
            callBack : function (type){
                return _.callBack[type];
            },
        },

        template : {},
        schema : {},
        callBack : {}
    };


    // Schema

    _.schema[TYPE_PRIMARY_KEY] = {
        name : "id",
        comment : "айди",
        type : _.TYPE_INT,
        autoincrement : true,
        nullable : false
    }
    _.schema[TYPE_CREATED] = {
        name : "created_at",
        comment : "дата создания",
        type : _.TYPE_DATETIME,
        autoincrement : false,
        nullable : false
    }
    _.schema[TYPE_UPDATED] = {
        name : "updated_at",
        comment : "дата редактирования",
        type : _.TYPE_DATETIME,
        autoincrement : false,
        nullable : true
    }



    function _upgrade(obj, params)
    {
        for (let key in params) {
            obj[key] = params[key];
        }

        return obj;
    }


    // Templates

    _.template[DB]  = function(name, params){
        this.name = name;
        this.comment = '';
        this.tables = {};
        this.getTable =  function(name)
        {
            return this.tables[name];
        }

        this.addTable = function(name, params)
        {
            _.create.table(this, name, params);

            return this;
        }

        this.createTable = function(name, params)
        {
            return _.create.table(this, name, params);
        }

        return _upgrade(this, params);
    };

    _.template[TABLE] = function(name, params){
        this.name = name;
        this.comment = '';
        this.fields = {};

        this.getField = function(name)
        {
            return this.fields[name];
        }

        this.hesField = function (name)
        {
            return (this[name] !== undefined);
        }

        this.addField = function(name, params)
        {
            return _.create.field(this, name, params);
        }

        return _upgrade(this, params);
    };

    _.template[FIELD] = function(name, type, params){
        this.name = name;
        this.comment = '';
        this.type = type;
        this.autoincrement = null;
        this.nullable = null;
        this.default = null;
        this.length = {
            min : null,
            fix : null,
            max : null
        }

        return _upgrade(this, params);
    };


    // CallBack's

    _.callBack[DB] = {
        beforeAdd : function (name, params){},
        afterAdd : function (db){},
    }
    _.callBack[TABLE] = {
        beforeAdd : function (db, name, params){},
        afterAdd : function (db, table){},
    }
    _.callBack[FIELD] = {
        beforeAdd : function (table, name, params){},
        afterAdd : function (table, field){},
    }


    // Actions

    _.create = {
        db: function (name, params)
        {
            _.get.callBack(DB)['beforeAdd'](name, params);

            _.db[name] = new _.template[DB](name, params);

            _.get.callBack(DB)['afterAdd'](_.db[name]);

            return _.db[name];
        },
        table: function (db, name, params)
        {
            _.get.callBack(TABLE)['beforeAdd'](db, name, params);

            db.tables[name] = new _.template[TABLE](name, params );

            _.get.callBack(TABLE)['afterAdd'](db, db.tables[name]);

            return db.tables[name];
        },
        field: function (table, name, type, params )
        {
            _.get.callBack(FIELD)['beforeAdd'](table, name, type, params);

            table.fields[name] = new _.template[FIELD](name, type, params );

            _.get.callBack(FIELD)['afterAdd'](table, table.fields[name]);

            return table;
        },
    };

})();
