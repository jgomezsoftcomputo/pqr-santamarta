
ko.bindingHandlers.enterPress = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var callback = valueAccessor();
        $(element).keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                $(element).blur();
                callback.call(viewModel);
                return false;
            }
            return true;
        });
    }
};

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value));
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

ko.bindingHandlers.readOnly = {
    init: function (element, valueAccessor) {
        if ($(element).find("[data-disable-key='searchElement']").length > 0) {
            $(element).find("[name='btnSearch']").attr("disabled", value);
            $(element).find("[name='btnCancel']").attr("disabled", value);
            $(element).find("[data-name='inputText']").attr("disabled", value);
            $(element).find("[name='selectFilter']").attr("disabled", value);
        } else {
            var value = valueAccessor();
            $(element).attr('readonly', value);
            if (!$(element).prop('readonly')) {
                $(element).attr("disabled", value);
            }
        }
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        if ($(element).find("[data-disable-key='searchElement']").length > 0) {
            $(element).find("[name='btnSearch']").attr("disabled", ko.utils.unwrapObservable(value));
            $(element).find("[name='btnCancel']").attr("disabled", ko.utils.unwrapObservable(value));
            $(element).find("[data-name='inputText']").attr("disabled", ko.utils.unwrapObservable(value));
            $(element).find("[name='selectFilter']").attr("disabled", ko.utils.unwrapObservable(value));
        } else {
            $(element).attr('readonly', ko.utils.unwrapObservable(value));
            if (!$(element).prop('readonly')) {
                $(element).attr("disabled", ko.utils.unwrapObservable(value));
            }
        }
    }
};
