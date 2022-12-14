
let mrMigrate = {};

(function()
{
    const
        _DB = 'db',
        _TABLE = 'table',
        _FIELD = 'field',

        TYPE_PRIMARY_KEY = '_primaryKey',
        TYPE_CREATED = '_created',
        TYPE_UPDATED = '_updated',
        TYPE_DATE = 'date',
        TYPE_DATETIME = 'date_time',
        TYPE_INT = 'int',
        TYPE_STRING = 'string';


    let _self;

    mrMigrate = _self = {

        TYPE_PRIMARY_KEY : TYPE_PRIMARY_KEY,
        TYPE_CREATED : TYPE_CREATED,
        TYPE_UPDATED : TYPE_UPDATED,
        TYPE_DATE : TYPE_DATE,
        TYPE_DATETIME : TYPE_DATETIME,
        TYPE_INT : TYPE_INT,
        TYPE_STRING : TYPE_STRING,

        db: {},

        schema: {
            TYPE_PRIMARY_KEY : {
                name : "id",
                comment : "айди",
                type : _self.TYPE_INT,
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

        template: {
            _DB : {
                name : null,
                comment : '',
                tables : {},
                getTable :  function(name)
                {
                    return this.tables[name];
                },
                addTable : function(name, params)
                {
                    mrMigrate.add.table(this, name, params);

                    return this;
                },
                createTable : function(name, params)
                {
                    return mrMigrate.add.table(this, name, params);
                }
            },
            _TABLE : {
                name : null,
                comment : '',
                fields : {},
                getField : function(name)
                {
                    return this.fields[name];
                },
                addField : function(name, params)
                {
                    mrMigrate.add.field(this, name, params);

                    return this;
                }
            },
            _FIELD: {
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
            }
        },

        create:
        {
            _upgrade: function (data, name, params)
            {
                data['name'] = name;

                for (let key in params) {
                    data[key] = params[key];
                }

                return data;
            },

            db: function (name, params)
            {
                _self.db[name] = _self.add._upgrade( _self.template[_DB], name, params );

                return _self.db[name];
            },

            table: function (db, name, params)
            {
                db.tables[name] = _self.add._upgrade( _self.template[_TABLE], name, params );

                return db.tables[name];
            },

            field: function (table, name, params)
            {
                table.fields[name] = _self.add._upgrade( _self.template[_FIELD], name, params )

                return table.fields[name];
            },
        }
    }

})();
