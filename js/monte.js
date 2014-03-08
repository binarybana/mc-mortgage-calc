$(function () {

  var plot_template = _.template($("#plot_template").html());

  function inputObject(plotel, id, mediator) {
    this.type = "input";
    this.mediator = mediator;
    this.details = { label:"Rate",
        value_id:id+"_value",
        input_id:id+"_input",
        minimum:0,
        maximum:20,
        step:1};
    this.update = function() {
      console.log('updating...');
      this.plot.setData([this.gen(this.params.rate)]);
      this.plot.draw();
      this.mediator.update();
    };

    this.gen = function(rate) {
        data = [];
        var x = this.details.minimum;
        for (i = 0; i < Math.round((this.details.maximum - this.details.minimum)/this.details.step); i++) {
          data.push([x, jStat.poisson.pdf(x, rate)]);
          x += this.details.step;
        }
        return data;
      };

    this.params = {rate:0};
    this.id = id;

    this.plot = $.plot(plotel, [this.gen(this.details.minimum)], 
      {'series': 
        { 'lines':{'show':false}, 
          'points':{'show':true, 'radius':7},
          'bars':{'show':false}}
      }); 

    var that = this;
    $(plotel).after(plot_template(this.details));
    $("#"+this.details.input_id).change(function (e) {
      $("#"+that.details.value_id).html(e.target.value);
      that.params.rate = parseFloat(e.target.value);
      that.update();
    });

    var yaxislabel = $("<div class='axisLabel yaxisLabel'></div>")
      .text("Probability")
      .appendTo($(plotel));
    yaxislabel.css("margin-top", yaxislabel.width() / 2 );
    //$("#"+this.details.slider_id).trigger("change");
    //this.update();
  }

  function outputObject(plotel, id) {
    this.type = "output";
    this.id = id;
    this.clear = function () {
      this.plot.setData([]);
      this.plot.draw();
    };

    this.update = function (data) {
      this.plot.setData([data]);
      this.plot.setupGrid();
      this.plot.draw();
    };

    this.plot = $.plot(plotel, [[0,0],[1,1],[2,2]], 
      {'series': 
        { 'lines':{'show':false}, 
          'points':{'show':true, 'radius':7},
          'bars':{'show':false}}
      }); 

    var yaxislabel = $("<div class='axisLabel yaxisLabel'></div>")
      .text("Probability")
      .appendTo($(plotel));
    yaxislabel.css("margin-top", yaxislabel.width() / 2 );
  }

  function Mediator() {
    this.inplots = [];
    this.outplot = null;
    this.register = function(plot) {
      if (plot.type == "input") {
        this.inplots.push(plot);
      }
      else {
        this.outplot = plot;
      }
    };

    var that = this;
    this.worker = new Worker("js/mcmc_spaghetti.js");
    this.worker.addEventListener("message", function (e) {
      that.outplot.update(e.data);
    });

    this.update = function () {
      // grab all values and pass to worker
      //this.inplots.each(function (
      this.outplot.clear();
      this.worker.postMessage({"test": 0});
    };
  }

  var mainMediator = new Mediator();

  $(".plot").each(function(i) {
    var type = this.dataset.type;
    var id = this.id;

    if (type == "poisson") {
      var newobj = new inputObject(this, id, mainMediator);
    } else if (type == "gaussian") {
      var newobj = new inputObject(this, id, mainMediator);
    } else if (type == "output") {
      var newobj = new outputObject(this, id);
    }
    mainMediator.register(newobj);
  });
});
