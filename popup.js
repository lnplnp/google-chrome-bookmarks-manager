// https://developer.chrome.com/extensions/bookmarks#method-search
chrome.bookmarks.search("_Current_Work",
  function(bookmarkNodes) {
    var i;
    var cWbookmarkNode;
    var nodes;
    var cWbookmarkNodeIds = new Array();
    var toParent;
    for (i = 0; i < bookmarkNodes.length; i++) {
      cWbookmarkNode = bookmarkNodes[i];
      if (cWbookmarkNode.id != 0
        && cWbookmarkNode.id != 1
        && cWbookmarkNode.id != 2
        && cWbookmarkNode.id != 3) {
        cWbookmarkNodeIds.push(cWbookmarkNode.id);
      }
    }
    cWbookmarkNodeIds.sort(function (a, b) {
      /* Numeric sorting */
      return parseInt(a) - parseInt(b);
    });
    console.log(cWbookmarkNodeIds.join());
    toParent = cWbookmarkNodeIds.shift();
    console.log();
    var position = 0;
    for (id in cWbookmarkNodeIds) {
      chrome.bookmarks.move(id,
        {
          parentId:"2",
          index:position
        },
        function (bookmarkTreeNode) {
          console.log(bookmarkTreeNode.id + " moved");
        }
      );
      /*
      position++;
      cWbookmarkNode = bookmarkNodes[i];
      if (id != 0 && id != 1 && id != 2 && id != 3) {
        chrome.bookmarks.getChildren(cWbookmarkNode.id, function (nodes){
          var node;
          var j;
          for (j = 0; j < bookmarkNodes.length; j++) {
            if (nodes[j]) {
              node = nodes[j];
              // if (node.parentId != toParent)
              // console.log(node);
            }
          }
        });
      }
      */
    }
  }
);
/*
  chrome.bookmarks.move(bookmarkNode.id,
    {
      parentId:"2",
      index:0
    },
    function (bookmarkTreeNode) {
      console.log(bookmarkTreeNode.id + " moved");
    }
  );
*/
