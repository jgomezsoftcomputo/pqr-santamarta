/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PQRService() {
    this.PATH = "pqr/";
}

PQRService.prototype.findAll = function (callback) {
        Middleware.get(this.PATH + "findAll", callback);
};

PQRService.prototype.findById = function (id, callback) {
    if (id) {
        var parameters = {};
        parameters.id = id;
        Middleware.getP(this.PATH + "findById", parameters, callback);
    }
};

PQRService.prototype.save = function (object, callback) {
    if (object) {
        Middleware.postJsonObject(this.PATH + "save", object, callback);
    }
};