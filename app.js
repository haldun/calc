var Notebook = function() {
  var self = this;

  this.rows = ko.observableArray([]);
  this.selectedRow = ko.observable(null);

  self.keyPressed = function(sender, event) {
    if (event.keyCode === 13) {
      self.addEmptyRow();
      return false;
    }
    return true;
  };

  self.addEmptyRow = function() {
    var row = new Row(self, "0");
    self.rows.push(row);
    self.selectedRow(row);
  };

  self.rowHasFocus = function(row) {
    return row === self.selectedRow();
  };
};

var Row = function(notebook, raw) {
  var self = this;

  this.notebook = notebook;
  this.raw = ko.observable(raw);

  this.computed = ko.computed(function(){
    try {
      return calculator.parse(ko.utils.unwrapObservable(self.raw));
    } catch(e) {
      return 0;
    }
  });

  this.isSelected = ko.computed(function() {
    return self === self.notebook.selectedRow();
  });
};

Row.prototype.toJSON = function() {
  return {
    raw: this.raw
  };
};
