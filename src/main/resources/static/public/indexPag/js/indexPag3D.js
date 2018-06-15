var GlobalViewer = null;
var pModelInfos = [];
var token = undefined;
var nowSelectedPModelInfo = null;
var nowSelectedComponentID = null;

$(function () {
    //$.parser.parse();
    GlobalViewer = initEarth("earth");
    initLiftClik()
    $('#tt').tree({
        onClick: function(node){
            if (node.id!=0){
                nodeClick(node);
                //console.log(1)
                console.log(node)
            }
            //alert(node.text);  // alert node text property when clicked
        }
    });
    $('#tt').tree({
        onContextMenu: function (e, node) {
            e.preventDefault();
            nodeExpand(node)
            //console.log(0)
            console.log(node)
        }
    });
    $('#tt').tree({
        onCheck: function (node, state) {
            onNodeCheckboxCheck(node,state);
        }
    });
})

function initEarth(containerID) {
    var viewer = Freedo.FdApp.createDefaultViewer(containerID, {
        homeButton: true // 是否展示Home按钮
    }, {
        //hasProvinceBoundaries: true // 是否绘制中国省界
        planeMode: true
    });
    viewer.scene.backgroundColor = Freedo.Color.fromCssColorString('#deebf7');
    return viewer;
}

function addBtnClick() {
    addPmdoel($("#eutbURL").val());
}

function addPmdoel(url) {
    var pmodelCache = {}
    Freedo.FdServer.FdPMTSParser.getPModelURLArray(url, function (pModelInfoArray) {
        var promise = new Promise(function (resolve, reject) {
            for (var i = 0; i < pModelInfoArray.length; i++) {
                var pModelInfo = pModelInfoArray[i];

                // 加载模型
                var pModel = GlobalViewer.scene.primitives.add(new Freedo.FreedoPModelset({
                    url: pModelInfo.pModelURL
                }));
                console.log(pModelInfo.pModelURL)
                pModelInfos.push({
                    mystate: true,
                    pModel: pModel,
                    matrix: pModelInfo.matrix,
                    matrixSet: pModelInfo.matrixSet,
                    layer: pModelInfo.layer
                });

                if (i === pModelInfoArray.length - 1) {
                    resolve();
                }

                pModel.readyPromise.then(function (pModel) {
                    // that._viewer.camera.viewBoundingSphere(pModel.boundingSphere,
                    //     new Freedo.HeadingPitchRange(
                    //         0, -0.5, 0));
                    // that._viewer.camera.lookAtTransform(Freedo.Matrix4.IDENTITY);
                    Freedo.FdCamera.FdPlaneViewCameraHelper.flyToBoundingSphere(GlobalViewer.scene, pModel.boundingSphere);
                });
            }
        });

        promise.then(function (res) {
            for (var i in pModelInfos) {
                if (pModelInfos[i].mystate){
                    var pModelInfo = pModelInfos[i];
                    var rootTree = {
                        tpModelInfo:pModelInfo,
                        id: pModelInfo.layer.identifier+"___"+pModelInfo.matrix.identifier,
                        text: pModelInfo.matrix.title,
                        title: pModelInfo.matrix.title,
                        uid: pModelInfo.matrix.uid,
                        //state : 'closed',
                        checked : true,
                        children: [],
                    }
                    var node = $('#tt').tree('find', 0);
                    $('#tt').tree('append', {
                        parent: node.target,
                        data:rootTree
                    })
                    pModelInfos[i].mystate = false;
                }
            }
            console.log(pModelInfos)
        })

    });
    return pmodelCache;
}

function initLiftClik() {
    var hanlder = new Freedo.ScreenSpaceEventHandler(GlobalViewer.scene.canvas);
    hanlder.setInputAction(function (movement) {
        GlobalViewer.camera.cancelFlight();
        var pos = movement.position;
        pickComponent(pos, true, function (pModel, componentID, ancestorComponents) {
            if (typeof pModel !== 'undefined' && typeof componentID !== 'undefined') {
                var pModelInfo = pModelInfos.find(function (element) {
                    return element.pModel === pModel;
                });
                //that.getComponentInfo(pModelInfo, componentID, ancestorComponents, 0);

                nowSelectedComponentID = componentID;
                nowSelectedPModelInfo = pModelInfo;
                $('#mydialog').window('open');
                $('#mydialog').dialog('refresh', 'plan/form?id='+componentID+'&modelId='+pModelInfo.layer.identifier+'___'+pModelInfo.matrix.identifier);
                console.log(pModelInfo)

                pModel.style = new Freedo.FreedoPModelStyle({
                    color: {
                        conditions: [
                            ['${component} ~== \'' + componentID + '\'',
                                'rgba(255, 0, 0, 1.0)'
                            ],
                            ['true', 'color("white")']
                        ]
                    },
                    show: 'true',
                });
                GlobalViewer.scene.requestRender();
            } else {
                pModelInfos.forEach(function (pModelInfo) {
                    var pModel = pModelInfo.pModel;
                    pModel.style = new Freedo.FreedoPModelStyle({});
                });
                GlobalViewer.scene.requestRender();
            }
        });

    }, Freedo.ScreenSpaceEventType.LEFT_CLICK);
}

function pickComponent(windowPosition, retAncestorComponents, selectedCallback) {
    var picked = GlobalViewer.scene.pick(windowPosition);
    //this.modelUI.componentInfo = {};
    // 阻挡测量模式的点选
    if (Freedo.defined(picked)) {
        var componentID = picked.getProperty('component');
        if (Freedo.defined(componentID)) {
            var ancestorComponents = undefined;
            if (retAncestorComponents) {
                ancestorComponents = picked.getAncestors('component');
            }
            selectedCallback(picked._content._tileset, componentID, ancestorComponents);
            return;
        }
    }

    selectedCallback();
}

function onNodeCheckboxCheck(node,state) {
    if (node){
        node.tpModelInfo.pModel.style = new Freedo.FreedoPModelStyle({
            /*color: {
                conditions: [
                    ['${component} ~== \'' + node.uid + '\'',
                        'rgba(255, 0, 0, 1.0)'
                    ],
                    ['true', 'color("white")']
                ]
            },*/
            show: {
                conditions: [
                    ['${component} ~== \'' + node.uid + '\'', ''+state+''],
                    ['true', 'true']
                ]
            },
        });
    }

    /*pModel.style = new Freedo.FreedoPModelStyle({
        show: {
            conditions: [
                ['${component} ~== \'' + componentID + '\'', 'false'],
                ['true', 'true']
            ]
        },
    });*/
    console.log(node)
    console.log(state)
}

function nodeClick(node) {
    //console.log('node', data, node);
   /* var pModelInfo = pModelInfos.find(function (element) {
        return element.matrix === data.matrix;
    });*/
    if(node.tpModelInfo){
        nowSelectedPModelInfo = node.tpModelInfo;
        nowSelectedComponentID = node.uid;
        $('#mydialog').window('open');
        $('#mydialog').dialog('refresh', 'plan/form?id='+nowSelectedComponentID+'&modelId='+nowSelectedPModelInfo.layer.identifier+'___'+nowSelectedPModelInfo.matrix.identifier);
        nowSelectedPModelInfo.pModel.style = new Freedo.FreedoPModelStyle({
            color: {
                conditions: [
                    ['${component} ~== \'' + nowSelectedComponentID + '\'',
                        'rgba(255, 0, 0, 1.0)'
                    ],
                    ['true', 'color("white")']
                ]
            },
            show: 'true',
        });
    }
}

function nodeExpand( node) {
    if (node.children.length != 0 ) {
        return false;
    } else {
        node.children = [];
    }
    Freedo.FdServer.FdPMTSParser.getCidJson(node.tpModelInfo.layer, node.tpModelInfo.matrixSet, node.tpModelInfo.matrix, node.tpModelInfo.matrixSet.roottileno, node.uid, token, function (json, error) {
        if (typeof error === 'undefined') {
            var objArray = []
            for (var i in json) {
                var item = json[i]
                var obj = {
                    tpModelInfo: node.tpModelInfo,
                    id: item.uid,
                    text: item.name || item.Name,
                    uid: item.uid,
                    checked : true,
                    children: [],
                }
                //data.child.push(obj);
                objArray.push(obj)
            }
            $('#tt').tree('append', {
                parent: node.target,
                data:objArray
            })
            // console.log(data);
            //treeSet.addNode(data.child, node);
        } else {
            console.log('error: ' + error);
        }
    })
}

function lookAtPlanClick() {
    var id = $('#nowPlanId').val();
    $('#myplandialog').window('open');
    $('#myplandialog').dialog('refresh', 'plan/allplanform?id='+id);
}

/*
function nodeClick(data, node) {
    console.log('node', data, node);
    var pModelInfo = pModelInfos.find(function (element) {
        return element.matrix === data.matrix;
    });
    if(pModelInfo){
        nowSelectedPModelInfo = pModelInfo;
        nowSelectedComponentID = data.uid;
        $('#mydialog').window('open');
        $('#mydialog').dialog('refresh', 'plan/form?id='+data.uid+'&modelId='+pModelInfo.layer.identifier+'___'+pModelInfo.matrix.identifier);
        pModelInfo.pModel.style = new Freedo.FreedoPModelStyle({
            color: {
                conditions: [
                    ['${component} ~== \'' + data.uid + '\'',
                        'rgba(255, 0, 0, 1.0)'
                    ],
                    ['true', 'color("white")']
                ]
            },
            show: 'true',
        });
    }
}

function nodeExpand(data, node) {
    if (data.child.length === 0 || data.child[0].title) {
        return false;
    } else {
        data.child = [];
    }
    Freedo.FdServer.FdPMTSParser.getCidJson(data.layer, data.matrixSet, data.matrix, data.roottileno, data.uid, token, function (json, error) {
        if (typeof error === 'undefined') {
            for (var i in json) {
                var item = json[i]
                var obj = {
                    layer: data.layer,
                    title: item.name || item.Name,
                    matrixSet: data.matrixSet,
                    matrix: data.matrix,
                    roottileno: data.matrixSet.roottileno,
                    uid: item.uid,
                    child: [{}],
                }
                data.child.push(obj);
            }
            // console.log(data);
            treeSet.addNode(data.child, node);
        } else {
            console.log('error: ' + error);
        }
    })
}*/
