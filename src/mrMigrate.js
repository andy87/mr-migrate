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
        TYPE_STRING = 'string',

        EVENT_BEFORE_ADD = 'event_after_add',
        EVENT_AFTER_ADD = 'event_after_add';


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
        events : {}
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

    let modelPrototype = function()
    {
        let _self = this;
        this.TYPE;

        this.name;

        this.trigger = function(event){
            return _.events[_self.TYPE][event](_self);
        }
    }

    _.template[DB]  = function(name, params)
    {
        modelPrototype.call(this);
        this.TYPE = DB;

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

    _.template[TABLE] = function(name, params)
    {
        modelPrototype.call(this);
        this.TYPE = TABLE;

        this.db_name = '';
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

    _.template[FIELD] = function(name, type, params)
    {
        modelPrototype.call(this);
        this.TYPE = FIELD;

        this.table_name = '';
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


    // Events

    _.events[DB][EVENT_BEFORE_ADD] = function (db) {
        return db;
    }
    _.events[DB][EVENT_AFTER_ADD] = function (db){
        return db;
    }
    _.events[TABLE][EVENT_BEFORE_ADD] = function (table){
        return table;
    }
    _.events[TABLE][EVENT_AFTER_ADD] = function (table){
        return table;
    }

    _.events[FIELD][EVENT_BEFORE_ADD] =  function (field){
        return field;
    }
    _.events[FIELD][EVENT_AFTER_ADD] = function (field){
        return field;
    }


    // Actions

    _.create = {
        db: function (name, params)
        {
            _.db[name] = (new _.template[DB](name, params)).trigger(EVENT_BEFORE_ADD);

            return _.db[name].trigger(EVENT_AFTER_ADD);
        },

        table: function (db, name, params)
        {
            params['db_name'] = db.name;

            db.tables[name] = (new _.template[TABLE](name, params )).trigger(EVENT_BEFORE_ADD);

            return db.tables[name].trigger(EVENT_AFTER_ADD);
        },

        field: function (table, name, type, params )
        {
            params['table_name'] = table.name;

            table.fields[name] = (new _.template[FIELD](name, type, params )).trigger(EVENT_BEFORE_ADD);

            table.fields[name].trigger(EVENT_AFTER_ADD);

            return table;
        }
    };
})();