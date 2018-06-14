/*$(function () {
    $('#myTree').tree({
        onClick: function (node) {
            console.log(node)
            if($('#myTree').tree('isLeaf',node.target)){//判断是否是叶子节点
                //alert(node.text);  // alert node text property when clicked
                $('#mydialog').window('open');
                $('#mydialog').dialog('refresh', 'plan/form?id='+node.text);
            }
        }
    });
})*/
/*function ceshi() {
    $('#mydialog').window('open');
    $('#mydialog').dialog('refresh', 'plan/form?id=0');
    $.messager.alert('Warning','The warning message');
       $.messager.confirm('Confirm','Are you sure you want to delete record?',function(r){
           if (r){
               alert('ok');
           }
       });
    //$('#dd').dialog('refresh', 'new_content.php');
}*/