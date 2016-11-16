/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function DepartamentosService() {
    this.PATH = "resourcespqr/";
}

DepartamentosService.prototype.findAll = function (callback) {
    Middleware.get(this.PATH + "departamentos", callback);
};
DepartamentosService.prototype.getDepartamento = function (idDepartamento, callback) {
    var parameters = {};
    parameters.idDepartamento = idDepartamento;
    Middleware.getP(this.PATH + "getDepartamento", parameters, callback);
};