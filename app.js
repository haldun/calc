var Notebook = function(data) {
  var self = this;

  this.name = ko.observable(data.name || "Untitled");
  this.rows = ko.observableArray([]);
  this.selectedRow = ko.observable(null);

  if (data.rows) {
    ko.utils.arrayForEach(data.rows, function(rowData) {
      self.rows.push(new Row(self, rowData));
    });
  }

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

  self.selectRow = function(row) {
    self.selectedRow(row);
  };
};

var Row = function(notebook, input) {
  var self = this;
  this.notebook = notebook;
  this.input = ko.observable(input);
  this.computed = ko.observable(false);
  this.index = ko.computed(function(){
    return ko.utils.arrayIndexOf(self.notebook.rows(), self) + 1;
  }, this);
  this.isSelected = ko.computed({
    read: function() {
      return self === self.notebook.selectedRow();
    },
    write: function(value) {
      if (value) {
        self.notebook.selectedRow(self);
      }
    }
  });
  this.answer = ko.computed(function(){
    try {
      self.computed(true);
      return calculator.parse(ko.utils.unwrapObservable(self.input));
    } catch(e) {
      return 0;
    }
  }, this);
};

Row.prototype.toJSON = function() {
  return {
    input: this.input
  };
};
