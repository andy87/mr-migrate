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


    mrMigrate = {

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

        db: {
            get : function (name)
            {
                return this[name] ?? null;
            }
        },

        schema: {
            TYPE_PRIMARY_KEY : {
                name : "id",
                comment : "айди",
                type : mrMigrate.TYPE_INT,
                autoincrement : true,
                nullable : false
            },
            TYPE_CREATED : {
                name : "created_at",
                comment : "дата создания",
                type : mrMigrate.TYPE_DATETIME,
                autoincrement : false,
                nullable : false
            },
            TYPE_UPDATED : {
                name : "updated_at",
                comment : "дата редактирования",
                type : mrMigrate.TYPE_DATETIME,
                autoincrement : false,
                nullable : true
            }
        },

        create:
            {
                _upgrade: function (type, name, params)
                {
                    let template = mrMigrate.template[type];

                    template['name'] = name;

                    for (let key in params) {
                        template[key] = params[key];
                    }

                    return template;
                },

                db: function (name, params)
                {
                    mrMigrate.db[name] = this._upgrade( DB, name, params );

                    return mrMigrate.db[name];
                },

                table: function (db, name, params)
                {
                    db.tables[name] = this._upgrade( TABLE, name, params );

                    return db.tables[name];
                },

                field: function (table, name, params)
                {
                    table.fields[name] = this._upgrade( FIELD, name, params )

                    return table.fields[name];
                },
            },

        template : {}
    }


    mrMigrate.template[DB] = {
        name : null,
        comment : '',
        tables : {},
        getTable :  function(name)
        {
            return this.tables[name];
        },
        addTable : function(name, params)
        {
            mrMigrate.create.table(this, name, params);

            return this;
        },
        createTable : function(name, params)
        {
            return mrMigrate.create.table(this, name, params);
        }
    };

    mrMigrate.template[TABLE] = {
        name : null,
        comment : '',
        fields : {},
        getField : function(name)
        {
            return this.fields[name];
        },
        addField : function(name, params)
        {
            mrMigrate.create.field(this, name, params);

            return this;
        }
    };

    mrMigrate.template[FIELD] = {
        name : null,
        comment : '',
        type : null,
        autoincrement : null,
        nullable : null,
        'default' : null,
        length : {
            min : null,
            fix : null,
            max : null
        }
    };

})();
