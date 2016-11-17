/* global PQRService */

function PQRController() {
    this.identificacion = ko.observable(null);
    this.nombre = ko.observable(null);
    this.idDepartamento = ko.observable(15);
    this.idMunicipio = ko.observable(740);
    this.idEntidad = ko.observable(null);
    this.clase = ko.observable(null);
    this.descripcion = ko.observable(null);
    this.archivos = ko.observableArray([]);
    this.departamentoName = ko.observable(null);
    this.municipioName = ko.observable(null);
    this.entidadName = ko.observable(null);
    this.claseName = ko.observable(null);
    this.enableField = ko.observable(true);
    this.hideSendButton = ko.observable(true);


    this.registros = ko.observableArray([]);
    this.departamentos = ko.observableArray([]);
    this.municipios = ko.observableArray([]);
    this.entidades = ko.observableArray([]);
    this.clasesPQR = ko.observableArray([]);

    this.toggleView = ko.observable(true);
    this.formPQR = $('#form_pqr');
    this.departamentosList = document.querySelector('[name="departamento"]');
    this.municipiosList = document.querySelector('[name="municipio"]');
    this.selectDepartamentos = $('[name="municipio"]');
    this.selectMunicipios = $('[name="municipio"]');
    this.selectEntidades = $('[name="entidad"]');
    this.selectClases = $('[name="clase"]');
    //Services
    this.pqrService = new PQRService();
    this.departamentosService = new DepartamentosService();
    this.municipiosServive = new MunicipiosService();
    this.entidadesPQRServive = new EntidadPQRService();
    this.typesService = new TypesService();
    this.fileEntryService = new FileEntryService();
    this.fileDownloadUtil = new FileDownloadUtil();
    //End service
    this.setup();
}

PQRController.prototype.setup = function () {
    var self = this;
    this.validate();

//    this.getDepartamentos();
this.getEntidades();
    this.getClasesPQR();
};


PQRController.prototype.validate = function () {
    var validation = {};
    validation.fields = {};
    validation.inline = true;
    validation.on = 'blur';
    var fields = validation.fields;

    fields.identificacion = {
        identifier: 'identificacion',
        rules: [
            {
                type: 'empty',
                prompt: 'La identificaión es obligatoria'
            }
        ]
    };

    fields.nombre = {
        identifier: 'nombre',
        rules: [
            {
                type: 'empty',
                prompt: 'El nombre es obligatorio'
            }
        ]
    };

    fields.departamento = {
        identifier: 'departamento',
        rules: []
    };

    fields.municipio = {
        identifier: 'municipio',
        rules: []
    };
    fields.entidad = {
        identifier: 'entidad',
        rules: [
            {
                type: 'empty',
                prompt: 'La entidad es obligatoria'
            }
        ]
    };
    fields.clase = {
        identifier: 'clase',
        rules: [
            {
                type: 'empty',
                prompt: 'La clase es obligatoria'
            }
        ]
    };

    fields.descripcion = {
        identifier: 'descripcion',
        rules: [
            {
                type: 'empty',
                prompt: 'La descripción es obligatoria'
            }
        ]
    };
    this.formPQR.form(validation);

};

//PQRController.prototype.getDepartamentos = function () {
//    var self = this;
//    this.departamentosService.findAll(function (data) {
//        if (data) {
//            self.departamentos(data);
//        }
//    });
//};
//
//PQRController.prototype.getMunicipios = function () {
//    var self = this;
//    if (this.idDepartamento()) {
////        self.selectMunicipios.dropdown('clear');
//        self.municipios([]);
//        this.municipiosServive.findByDepartamento(this.idDepartamento(), function (data) {
//            if (data) {
//                self.municipios(data);
//            }
//        });
//    }
//};

PQRController.prototype.getEntidades = function () {
    var self = this;
    if (this.idMunicipio()) {
//        self.selectEntidades.dropdown('clear');
        self.entidades([]);
        this.entidadesPQRServive.findByMunicipio(this.idMunicipio(), function (data) {
            if (data && data.totalRegistros > 0) {
                var entidades = [];
                data.registros.map(function (entidad) {
                    entidades.push({valor: entidad.id, descripcion: entidad.nombre});
                });
                self.entidades(entidades);
            }
        });
    }

};

PQRController.prototype.getClasesPQR = function () {
    var self = this;
    this.typesService.findByName("TipoClasePQR", function (data) {
        if (data) {
            self.clasesPQR(data);
        }
    });
};

PQRController.prototype.send = function () {
    var pqr = {};
    var self = this;

    pqr.fecha = moment().toDate().getTime();
    pqr.identificacion = this.identificacion();
    pqr.nombre = this.nombre();
    pqr.idEntidadPqr = this.idEntidad();
    pqr.clasePQR = this.clase();
    pqr.descripcion = this.descripcion();

    pqr.archivoPQRDTOs = [];

    if (this.archivos().length > 0) {
        pqr.archivoPQRDTOs = this.archivos();
    }

    if (this.formPQR.form('is valid')) {
        this.pqrService.save(pqr, function (result) {
            self.clear();
            toastr.options.positionClass = "toast-bottom-center";
            toastr.success('Registro exitoso!');
        });
    } else {
        toastr.warning('Campos vacios y/o mal diligenciados');
    }

};

PQRController.prototype.toggle = function () {
    this.toggleView(!this.toggleView());
    var self = this;

    if (this.toggleView() === false) {
        this.pqrService.findAll(function (data) {
            if (data && data.totalRegistros > 0) {
                self.registros(data.registros);
            }
        });
        this.hideSendButton(false);
    } else {
        this.hideSendButton(true);
        this.clear();
    }

};

PQRController.prototype.show = function (data) {
    var self = this;

    if (data) {
        this.clear();
        this.pqrService.findById(data.id, function (result) {
            if (result && result.totalRegistros > 0) {
                var data = result.registros[0];
                console.info(data);
                var entidad = data.entidadPQR;
                var idMunicipio = entidad.municipio ? entidad.municipio.id : null;
                var idDepartamento = null;
                if (entidad.municipio) {
                    idDepartamento = entidad.municipio.departamento ? entidad.municipio.departamento.id : null;
                }
                var idEntidad = entidad ? entidad.id : null;

                self.identificacion(data.identificacion ? data.identificacion : null);
                self.nombre(data.nombre ? data.nombre : null);
                var clase = data.clasePQR;
                console.log(clase);
                self.clase(clase ? clase : null);

                if (idDepartamento) {
                    self.departamentosService.getDepartamento(idDepartamento, function (result) {
                        if (result.registros) {
                            var data = result.registros[0];
                            if (data && data.nombre) {
                                self.departamentoName(data.nombre);
                            }
                        }

                    });
                }

                if (idMunicipio) {
                    self.municipiosServive.getMunicipio(idMunicipio, function (result) {
                        if (result.registros) {
                            var data = result.registros[0];
                            if (data && data.nombre) {
                                self.municipioName(data.nombre);
                            }
                        }
                    });
                }

                if (idEntidad) {
                    self.entidadesPQRServive.findById(idEntidad, function (result) {
                        if (result.registros) {
                            var data = result.registros[0];
                            if (data && data.nombre) {
                                self.entidadName(data.nombre);
                            }
                        }
                    });
                }

                self.claseName(clase);

                var archivos = data.archivoPQRs;
                if (archivos) {
                    archivos.forEach(function (file) {
                        var idArchivo = file.idArchivo;
                        self.fileEntryService.findFile(idArchivo, function (result) {
                            if (result) {
                                var name = result.name;
                                var data = result.data;
                                var extension = name.split(".").pop().toLowerCase();


                                var guideToAddFile = document.getElementById("guideToAddFile");
                                var parent = guideToAddFile.parentNode;
                                var grid = document.createElement("DIV");
                                grid.classList.add("ui", "grid");

                                var button = document.createElement("DIV");
                                button.classList.add("ui", "button", "blue");
                                button.tabindex = "0";
                                button.innerHTML = '<i class="fa fa-download "></i>';
                                button.addEventListener("click", function (e) {
                                    if (extension !== 'pdf') {
                                        self.fileDownloadUtil.download(name, Base64PQR.decode(data), 'image/' + extension);
                                    } else {
                                         self.fileDownloadUtil.download(name, Base64PQR.decode(data), 'application/' + extension);
                                    }
                                });


                                var buttonContainer = document.createElement("DIV");
                                buttonContainer.classList.add("one", "wide", "column");
                                buttonContainer.appendChild(button);

                                var inputContainer = document.createElement("DIV");
                                inputContainer.classList.add("thirteen", "wide", "column");
                                inputContainer.innerHTML = '<input type="text" value="' + name + '" disabled>';

                                grid.appendChild(inputContainer);
                                grid.appendChild(buttonContainer);

                                parent.insertBefore(grid, guideToAddFile);

                                console.info(result);

                            }
                        });
                    });
                }



                self.descripcion(data.descripcion ? data.descripcion : null);
            }
        });

        this.toggleView(true);
        this.hideSendButton(false);
        this.enableField(false);
//        this.selectDepartamentos.dropdown('destroy');
//        this.selectMunicipios.dropdown('destroy');
//        this.selectEntidades.dropdown('destroy');
//        this.selectClases.dropdown('destroy');
    }
};

PQRController.prototype.addFileToTheView = function () {
    var self = this;

    var inputFile = document.createElement("input");
    var extensions = ['jpg', 'png', 'jpeg', 'gif', 'pdf'];

    inputFile.type = "file";
    inputFile.addEventListener("change", function (event) {
        var file = inputFile.files[0];
        var isValidExtension = false;
        var fileName = null;
        var contentFile = null;
        var extension = file.name.split(".").pop().toLowerCase();

        extensions.forEach(function (ext) {
            if (extension === ext) {
                isValidExtension = true;
            }
        });

        if (file && isValidExtension) {
            var reader = new FileReader();
            reader.onload = function (e) {
                contentFile = e.target.result;
                fileName = file.name;

                var archivo = {
                    fileName: fileName,
                    contentFile: Base64PQR.encode(contentFile)
                };
                self.archivos.push(archivo);

                console.log(self.archivos());
                console.log(contentFile);

                var guideToAddFile = document.getElementById("guideToAddFile");
                var parent = guideToAddFile.parentNode;
                var grid = document.createElement("DIV");
                grid.classList.add("ui", "grid");

                var button = document.createElement("DIV");
                button.classList.add("ui", "button", "red");
                button.tabindex = "0";
                button.innerHTML = '<i class="fa fa-minus "></i>';
                button.addEventListener("click", function (e) {
                    var target = e.target;
                    var columnParent;
                    var gridParent;
                    console.log(target.nodeName);
                    if (target.nodeName === "DIV") {
                        columnParent = target.parentNode;
                        gridParent = columnParent.parentNode;
                        parent.removeChild(gridParent);
                    } else if (target.nodeName === "I") {
                        var buttonParent = target.parentNode;
                        columnParent = buttonParent.parentNode;
                        gridParent = columnParent.parentNode;
                        parent.removeChild(gridParent);
                    }
                    self.archivos.remove(archivo);
                    console.log(self.archivos());
                });


                var buttonContainer = document.createElement("DIV");
                buttonContainer.classList.add("one", "wide", "column");
                buttonContainer.appendChild(button);

                var inputContainer = document.createElement("DIV");
                inputContainer.classList.add("thirteen", "wide", "column");
                inputContainer.innerHTML = '<input type="text" value="' + fileName + '" disabled>';

                grid.appendChild(inputContainer);
                grid.appendChild(buttonContainer);

                parent.insertBefore(grid, guideToAddFile);

            };
            reader.readAsDataURL(file);
        } else {
            toastr.warning("Tipo de archivo no soportado");
            console.log("Archivo no válido");
        }
    });

    inputFile.click();

};


PQRController.prototype.clear = function () {
    this.enableField(true);
    this.formPQR.form('reset');
    this.identificacion(null);
    this.nombre(null);
    this.idDepartamento(null);
    this.idMunicipio(null);
    this.idEntidad(null);
    this.clase(null);
    this.descripcion(null);
    this.departamentoName(null);
    this.municipioName(null);
    this.entidadName(null);
    this.claseName(null);
    this.archivos([]);

    var guideToAddFile = document.getElementById("guideToAddFile");
    var parent = guideToAddFile.parentNode;

    var grids = parent.querySelectorAll(".grid");
    console.log(grids);
    var gridArray = Array.prototype.slice.call(grids);

    gridArray.map(function (g) {
        parent.removeChild(g);
    });




};

ko.applyBindings(new PQRController, document.getElementById("pqr_module"));