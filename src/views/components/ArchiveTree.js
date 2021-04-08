import React, { useEffect, useCallback, useState } from "react";

import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';



const ArchiveTree = ({ data }) => {

    const [test, setTest] = useState([]);

    useEffect(() => {
        setTest(data)
        data.forEach((e) => {

        })
    }, [data]);

    const onNodeSelect = (nodeKey, node) => {
        console.log(node)
    }

  
    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            onNodeSelect={onNodeSelect}
        >
            {data.map((objectRow, indexP) => (
                <TreeItem nodeId={objectRow} label={objectRow.date.split("T")[0]} >
                    <TreeItem nodeId={"rapports".concat(objectRow._id)} label="Rapports">
                        {objectRow.rapport.map((objectRow, indexC) => (
                            <div>
                                <TreeItem nodeId={objectRow._id} label={objectRow.name} />
                            </div>
                        ))}
                    </TreeItem>
                    <TreeItem nodeId={"annexes".concat(objectRow._id)} label="Annexes">
                        {objectRow.annexe.map((objectRow, indexC) => (
                            <div>
                                <TreeItem nodeId={objectRow._id} label={objectRow.name} />
                            </div>
                        ))}
                    </TreeItem>

                </TreeItem>
            ))}
        </TreeView>
    );
};

export default ArchiveTree;