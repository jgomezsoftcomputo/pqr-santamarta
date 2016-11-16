/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function TypesService() {
    this.PATH = "resourcespqr/";
}

TypesService.prototype.findAll = function (callback) {
    Middleware.get(this.PATH + "getTypes", callback);
};


TypesService.prototype.findByName = function (name, callback) {
    Middleware.get(this.PATH + "getTypes", function (data) {
        if (data && name) {
            if (data.hasOwnProperty(name)) {
                var types = data[name];
                if (callback) {
                    callback(types);
                }
            }
        }
    });
};
