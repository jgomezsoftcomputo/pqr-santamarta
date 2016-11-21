/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * @author softcomputo
 */
(function () {
    function Middleware() {
        this.TIPO_SCOPE_DEVP = "d";
        this.TIPO_SCOPE_PROD = "p";

        this.RESPUESTA_SOLICITUD_OK = "OK";
        //Variable para consultar el nombre de la base de datos en mongo que se encuentra en la tabla parametro_config //
        this.INDEX_DB_NAME = "index_db_name";
        this.DATA_BASE_NAME_INDEX_MONGO = "crue";

        this.contentTypeJson = "application/json";
        this.contentTypePostUrl = "application/x-www-form-urlencoded; charset=UTF-8";
        this.contentTypeGetUrl = "text/*";

        /**
         * Esta variable Scope me permite especificar como trabajar al back end
         * */
//        this.scope = this.TIPO_SCOPE_DEVP;
        this.scope = this.TIPO_SCOPE_PROD;

        this.backendPath = {
            url_backend: "http://192.168.1.9:8080/psmanagercrue-webui",
            url_path_backend: "/reportepqr/",
            url_backend_index: "/indexservice",
            url_path_backend_index: "/webresources/",
            url_rest_index: "index/find",
            url_rest_index_conditional: "index/findConditional",
            url_rest_index_save: "index/save",
            url_rest_index_update: "index/update"
        };

        this.URL_BACKEND = this.backendPath.url_backend;
        this.getPath = this.backendPath;
    }

    Middleware.prototype.v = function (nameIndexMongo) {
        this.DATA_BASE_NAME_INDEX_MONGO = nameIndexMongo;
    };

    Middleware.prototype.sendServer = function (url, method, data, contentType, callback) {
        var self = this;
//        callback.loading = (typeof callback.loading !== 'undefined') ? callback.loading : true;
//        if (callback.loading) {
//            loadingController.show();
//        }
        $.ajax({
            url: url,
            type: method,
            data: data,
            dataType: 'json',
            contentType: contentType,
            success: function (data) {
//                try {
                if (callback) {
                    if (method === 'POST') {
                        if (data.tipoRespuesta === self.RESPUESTA_SOLICITUD_OK) {
                            callback(data);
                        } else {
                            console.error("Mensaje recibido ->" + data.msj);
                        }
                    } else {
                        callback(data);
                    }
                } else if (method === 'POST' && data.tipoRespuesta !== self.RESPUESTA_SOLICITUD_OK) {
                    console.error("Mensaje recibido ->" + data.msj);
                }
//                } catch (err) {
//                    console.error(err);
//                    console.log("url: " + url);
//                    msg.data('messageBox').warning('Error', err);
//                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                if (callback.error) {
                    callback.error(errorThrown);
                }

                if (jqXHR.status !== 401 && !callback.error) {
                    
//                    msg.data('messageBox').warning('Error', jqXHR.readyState === 0 ? 'Error al conectarse al servidor, por favor verifique su conexión a internet' : textStatus);
                }
            },
            statusCode: {
                400: function (xhr) {
                        console.log(xhr.responseText);
//                    msg.data('messageBox').warning('Advertencia', "Petición incorrecta, por favor contacte se con su proveedor");
                },
                401: function () {
                    console.log("perdio la sesion");
//                    $("body").html("<h1>Ha perdido la sesión</h1><h2><a href=\"" + self.backendPath.url_backend + "\">Ir al inicio de sesión</a></h2>");
                },
                403: function () {
                    console.log("Usuario no cuenta con los permisos correspondientes");
//                    $("body").html("<h1>Usuario no cuenta con los permisos correspondientes</h1><h2><a href=\"" + self.backendPath.url_backend + "\">Ir al inicio de sesión</a></h2>");
                },
                408: function () {
//                    msg.data('messageBox').warning('Advertencia', "La petición ha caducado por favor refresque la pagina");
                },
                500: function (xhr) {
//                    if (window.console)
                    console.log(xhr.responseText);
//                    msg.data('messageBox').warning('Advertencia', "Ha sucedido un error en el servidor, por favor contacte se con su proveedor");
                }
            }
        }).always(function () {
//            if (callback.loading) {
//                loadingController.stop();
//            }
            if (callback.always) {
                callback.always();
            }
        });
    };

    Middleware.prototype.post = function (url, data, callback) {
        callback.validPost = true;
        this.sendServer(this.backendPath.url_backend + this.backendPath.url_path_backend + url, 'POST', data, this.contentTypePostUrl, callback);
    };

    Middleware.prototype.postFormData = function (url, formData, callback) {
        var self = this;
        callback.validPost = true;
        //callback.noDataType = "html";
//        callback.loading = (typeof callback.loading !== 'undefined') ? callback.loading : true;
//        if (callback.loading) {
//            loadingController.show();
//        }
        $.ajax({
            url: this.backendPath.url_backend + this.backendPath.url_path_backend + url,
            type: 'POST',
            data: formData,
            processData: false, // tell jQuery not to process the data
            contentType: false, // tell jQuery not to set contentType
            success: function (data) {
                try {
                    if (callback && typeof callback.ok !== 'undefined') {
                        if (data.tipoRespuesta === self.RESPUESTA_SOLICITUD_OK) {
                            callback.ok(data);
                        } else {
                            msg.data('messageBox').warning('Advertencia', data.msj);
                        }
                    } else if (data.tipoRespuesta !== self.RESPUESTA_SOLICITUD_OK) {
                        msg.data('messageBox').warning('Advertencia', data.msj);
                    }
                } catch (err) {
                    console.error(err);
                    console.log("url: " + url);
                    msg.data('messageBox').warning('Error', err);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (window.console) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
                if (callback.error) {
                    callback.error(errorThrown);
                }

                if (jqXHR.status !== 401 && !callback.error) {
                    msg.data('messageBox').warning('Error', jqXHR.readyState === 0 ? 'Error al conectarse al servidor, por favor verifique su conexión a internet' : textStatus);
                }
            },
            statusCode: {
                400: function (xhr) {
                    if (window.console)
                        console.log(xhr.responseText);
                    msg.data('messageBox').warning('Advertencia', "Petición incorrecta, por favor contacte se con su proveedor");
                },
                401: function () {
                    if (console)
                        console.log("perdio la sesion");
                    //                    autenticacionController.show();
                    $("body").html("<h1>Ha perdido la sesión</h1><h2><a href=\"" + self.backendPath.url_backend + "\">Ir al inicio de sesión</a></h2>");
                },
                403: function () {
                    if (console)
                        console.log("Usuario no cuenta con los permisos correspondientes");
                    //                    autenticacionController.show();
                    $("body").html("<h1>Usuario no cuenta con los permisos correspondientes</h1><h2><a href=\"" + self.backendPath.url_backend + "\">Ir al inicio de sesión</a></h2>");
                },
                408: function () {
                    msg.data('messageBox').warning('Advertencia', "La petición ha caducado por favor refresque la pagina");
                },
                500: function (xhr) {
                    if (window.console)
                        console.log(xhr.responseText);
                    msg.data('messageBox').warning('Advertencia', "Ha sucedido un error en el servidor, por favor contacte se con su proveedor");
                }
            }
        }).always(function () {
            if (callback.loading) {
                loadingController.stop();
            }
            if (callback.always) {
                callback.always();
            }
        });

        //sendServer(backendPath.url_backend + backendPath.url_path_backend + url, 'POST', formData, false, callback);
    };

    Middleware.prototype.postJsonObject = function (url, jsonObject, callback) {
//        callback.validPost = true;
        this.sendServer(this.backendPath.url_backend + this.backendPath.url_path_backend + url, 'POST', JSON.stringify(jsonObject), this.contentTypeJson, callback);
    };

    Middleware.prototype.getP = function (url, data, callback) {
        this.sendServer(this.backendPath.url_backend + this.backendPath.url_path_backend + url, 'GET', data, this.contentTypeGetUrl, callback);
    };

    Middleware.prototype.get = function (url, callback) {
        this.sendServer(this.backendPath.url_backend + this.backendPath.url_path_backend + url, 'GET', {}, this.contentTypeGetUrl, callback);
    };

    Middleware.prototype.getIndex = function (entityName, data, callback, url) {
        var url_final = url || this.backendPath.url_rest_index;
        var dataIndex = {
            databaseName: this.DATA_BASE_NAME_INDEX_MONGO,
            entityName: entityName
        };
        this.sendServer(this.backendPath.url_backend_index + this.backendPath.url_path_backend_index + url_final, 'GET', $.extend(dataIndex, data), this.contentTypeGetUrl, callback);
    };

    Middleware.prototype.saveIndex = function (entityName, data, callback) {
        callback.noDataType = 'noDataType';
        var url_final = this.backendPath.url_rest_index_save;
        var dataIndex = {
            databaseName: this.DATA_BASE_NAME_INDEX_MONGO,
            entityName: entityName
        };
        this.sendServer(this.backendPath.url_backend_index + this.backendPath.url_path_backend_index + url_final, 'POST', $.extend(dataIndex, data), this.contentTypePostUrl, callback);
    };

    Middleware.prototype.updateIndex = function (entityName, data, callback) {
        callback.noDataType = 'noDataType';
        var url_final = this.backendPath.url_rest_index_update;
        var dataIndex = {
            databaseName: this.DATA_BASE_NAME_INDEX_MONGO,
            entityName: entityName
        };
        this.sendServer(this.backendPath.url_backend_index + this.backendPath.url_path_backend_index + url_final, 'POST', $.extend(dataIndex, data), this.contentTypePostUrl, callback);
    };

    Middleware.prototype.closeSession = function () {
        var self = this;
        $.ajax({
            url: this.backendPath.url_backend + this.backendPath.url_path_backend + "session/invalidarSesion",
            type: 'GET'
        }).always(function () {
            var pContext = $.cookie('pContext') || "";
            window.onbeforeunload = undefined;
            window.location.href = self.backendPath.url_backend + "?p=" + pContext;
        });
    };

    Middleware.prototype.getScope = function () {
        return this.scope;
    };

    Middleware.prototype.getUserSessionWithCargosEmpresa = function (callback) {
        var self = this;
        $.ajax({
            url: this.backendPath.url_backend + this.backendPath.url_path_backend + "session/getUserSessionWithCargosEmpresa",
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (callback.ok) {
                    callback.ok(data);
                }
            },
            statusCode: {
                401: function () {
                    if (window.console)
                        console.log("perdio la sesion");
                    $("body").html("<h1>Ha perdido la sesión</h1><h2>Espere por favor, será redireccionado</h2>");
                    window.location.href = self.backendPath.url_backend;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (window.console) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
                if (callback.error) {
                    callback.error(errorThrown);
                }
            }
        });
    };

    Middleware.prototype.getUserSession = function (callback) {
        var self = this;
        $.ajax({
            url: self.backendPath.url_backend + self.backendPath.url_path_backend + "session/getUserSession",
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (callback.ok) {
                    callback.ok(data);
                }
            },
            statusCode: {
                401: function () {
                    if (window.console)
                        console.log("perdio la sesion");
                    $("body").html("<h1>Ha perdido la sesión</h1><h2>Espere por favor, será redireccionado</h2>");
                    window.location.href = self.backendPath.url_backend;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (window.console) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
                if (callback.error) {
                    callback.error(errorThrown);
                }
            }
        });
    };

    Middleware.prototype.getDireccionEmpresaUsuario = function (callback) {
        $.ajax({
            url: this.backendPath.url_backend + this.backendPath.url_path_backend + "session/getDireccion",
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (callback.ok) {
                    callback.ok(data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                if (callback.error) {
                    callback.error(errorThrown);
                }
            }
        });
    };

    Middleware.prototype.updateCargoEmpresa = function (idCargoEmpresa, idRol, idEmpresa, idCentroAtencion) {
        $.ajax({
            url: this.backendPath.url_backend + this.backendPath.url_path_backend + "session/updateCargoEmpresa",
            type: 'POST',
            data: {idCargoEmpresa: idCargoEmpresa, idRol: idRol, idEmpresa: idEmpresa, idCentroAtencion: idCentroAtencion}
        }).done(function () {
            window.onbeforeunload = undefined;
            window.location.href = "";
        });
    };

    Middleware.prototype.waitProcess = function (uuid, callback, loops) {
        if (loops) {
            if (!$.isNumeric(loops)) {
                loops = 30;
            }
        } else {
            loops = 30;
        }
        if (loops > 0) {
            loadingController.show();
            $.ajax({
                url: this.backendPath.url_backend + this.backendPath.url_path_backend + "tx/consultarUuid",
                type: 'GET',
                data: {uuid: uuid}
            }).done(function (resultado) {
                var estado = resultado.totalRegistros > 0 ? resultado.registros[0].estado : "";
                switch (estado) {
                    case "FINALIZADA":
                        loadingController.stop();
                        if (callback.ok) {
                            callback.ok();
                        }
                        break;
                    case "ERROR":
                        loadingController.stop();
                        if (callback.error) {
                            callback.error("Estado de transacción: ERROR");
                        }
                        break;
                    default:
                        setTimeout(function () {
                            waitProcess(uuid, callback, --loops);
                        }, 1000);
                }
            }).fail(function (errorThrown) {
                loadingController.stop();
                if (callback.error) {
                    callback.error(errorThrown);
                }
            });
        } else {
            loadingController.stop();
            if (callback.error) {
                callback.error("timeout");
            }
            msg.data('messageBox').warning('Advertencia', "Tiempo de espera ha terminado");
        }
    };

    window.Middleware = new Middleware();
})();
