import Tree from 'rc-tree';
import React, { useRef, useState, useCallback } from 'react';
import './tree-styles.css';
import { getTreeData } from './data.ts';

function titleRender(node) {
  return <div>{node.title}</div>;
}

export const MyTree = () => {
  const treeRef = useRef(null);
  const [data, setData] = useState(getTreeData());
  const [expandedKeys, setExpandedKeys] = useState([
    '0-0-key',
    '0-0-0-key',
    '0-0-0-0-key',
  ]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onDragEnter = useCallback(({ expandedKeys }) => {
    console.log('enter', expandedKeys);
    setExpandedKeys(expandedKeys);
  }, []);

  const onDrop = useCallback(
    (info) => {
      console.log('drop', info);
      const dropKey = info.node.props.eventKey;
      const dragKey = info.dragNode.props.eventKey;
      const dropPos = info.node.props.pos.split('-');
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const loop = (items, key, callback) => {
        items.forEach((item, index, arr) => {
          if (item.key === key) {
            callback(item, index, arr);
            return;
          }
          if (item.children) {
            loop(item.children, key, callback);
          }
        });
      };

      const newData = [...data];
      let dragObj;

      loop(newData, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        loop(newData, dropKey, (item) => {
          item.children = item.children || [];
          item.children.push(dragObj);
        });
      } else if (
        (info.node.props.children || []).length > 0 &&
        info.node.props.expanded &&
        dropPosition === 1
      ) {
        loop(newData, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj);
        });
      } else {
        let ar;
        let i;
        loop(newData, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }

      setData(newData);
    },
    [data]
  );

  const onExpand = useCallback((expandedKeys) => {
    console.log('onExpand', expandedKeys);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  }, []);

  return (
    <Tree
      treeData={data}
      ref={treeRef}
      draggable={true}
      selectable={false}
      defaultExpandAll
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      autoExpandParent={autoExpandParent}
      height={500}
      itemHeight={20}
      style={{ border: '1px solid #000' }}
      titleRender={titleRender}
      // onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
    />
  );
};
