$(function () {
  function getrand(mu) {
  }

  //var plot_template = _.template("<p><%= label %>: <span id='<%= value_id %>'></span><input id='<%= input_id %>' type='range' min='<%= minimum %>' max='<% maximum %>' step='<%= step %>' style='width:600px'></p>");

  var plot_template = _.template($("#plot_template").html());

  // For each .plot div: setup the plot then:
  // if .input: 
  //    add slider depending on dataset.plottype
  //    init plot depending on dataset.plottype, 
  //    connect events for slider to input
  // if .output:
  //    pass
  
  $(".plot").each(function(i) {
    var type = this.dataset.type;
    var id = this.id;
    //if (type == "poisson") {
      var details = { label:"Rate",
        value_id:id+"_value",
        input_id:id+"_input",
        minimum:0,
        maximum:20,
        step:1};

      var gen = function(rate) {
        data = [];
        var x = details.minimum;
        for (i = 0; i < Math.round((details.maximum - details.minimum)/details.step); i++) {
          data.push([x, jStat.poisson.pdf(x, rate)]);
          x += details.step;
        }
        return data;
      };

      var plot = $.plot(this, [gen(details.minimum)], 
        {'series': 
          { 'lines':{'show':false}, 
            'points':{'show':true, 'radius':7},
            'bars':{'show':false}}
        }); 


      $(this).after(plot_template(details));
      bind_slider(details.input_id, details.value_id, gen);

    //} else if (type == "gaussian") {
      //$(this).after(plot_template(...));
      //bind_slider(...)
      //$(this).after(plot_template(...));
      //bind_slider(...)
    //}

    var yaxislabel = $("<div class='axisLabel yaxisLabel'></div>")
      .text("Probability")
      .appendTo($(this));

    yaxislabel.css("margin-top", yaxislabel.width() / 2 );

    function bind_slider(slider_id, value_id, gen) {
      $("#"+slider_id).change(function (e) {
        //console.log(e)
        plot.setData([gen(e.target.value)]);
        //plot.setupGrid();
        plot.draw();
        $("#"+value_id).html(parseFloat(e.target.value).toFixed(1))
        });
      $("#"+slider_id).trigger("change");
    }
  });
});
