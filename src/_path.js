FlowJS.PathTools = {

  _getBasePoints: (type, initialPosition, finalPosition) => {
    var x1 = 0;
    var x2 = 0;
    var x3 = 0;
    var x4 = 0;

    var y1 = 0;
    var y2 = 0;

    if (type == FlowJS.ConnectorType.Output) {
      x1 = initialPosition.x;
      x2 = initialPosition.x + FlowJS.Config.Link.InitialLength;
      y1 = initialPosition.y;

      x3 = finalPosition.x - FlowJS.Config.Link.InitialLength;
      x4 = finalPosition.x;
      y2 = finalPosition.y;
    } else {

      x1 = finalPosition.x;
      x2 = finalPosition.x + FlowJS.Config.Link.InitialLength;
      y1 = finalPosition.y;

      x3 = initialPosition.x - FlowJS.Config.Link.InitialLength;
      x4 = initialPosition.x;
      y2 = initialPosition.y;
    }

    return {
      x1: x1,
      x2: x2,
      x3: x3,
      x4: x4,
      y1: y1,
      y2: y2
    }
  },

  CustomDataFunction: undefined,

  GetDataCustom: (type, initialPosition, finalPosition) => {
    if (FlowJS.PathTools.CustomDataFunction) {
      return CustomDataFunction(type, initialPosition, finalPosition);
    }

    return FlowJS.PathTools.GetDataDirect(type, initialPosition, finalPosition);
  },

  GetDataDirect: (type, initialPosition, finalPosition) => {
    var points = FlowJS.PathTools._getBasePoints(type, initialPosition, finalPosition);

    var data = `M${points.x1} ${points.y1} L${points.x2} ${points.y1} ${points.x3} ${points.y2} ${points.x4} ${points.y2}`;
    return data;
  },

  GetDataSpline: (type, initialPosition, finalPosition) => {

    var points = FlowJS.PathTools._getBasePoints(type, initialPosition, finalPosition);

    var halfX = (points.x2 + points.x3) / 2;
    var halfY = (points.y1 + points.y2) / 2;

    var data = `M${points.x1} ${points.y1}`;
    data += `Q${points.x2 + (FlowJS.Config.Link.InitialLength * 2)} ${points.y1} ${halfX} ${halfY}`;
    data += `M${points.x4} ${points.y2}`;
    data += `Q${points.x3 - (FlowJS.Config.Link.InitialLength * 2)} ${points.y2} ${halfX} ${halfY}`;
    return data;
  },
}