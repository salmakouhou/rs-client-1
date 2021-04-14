import React, { useEffect, useCallback, useState } from "react";

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';





const ArchiveTree = ({ data,downloadRapport }) => {

    const [test, setTest] = useState([]);

    

    useEffect(() => {
        setTest(data)
        
    }, [data]);

    const onNodeSelect = (nodeKey, node) => {
        if(node.includes("/"))
           downloadRapport(node)
    }

    

    return (

        <div>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeSelect={onNodeSelect}>

                {data.map((dataObjectRow, indexP) => (
                    <TreeItem nodeId={"item".concat(indexP)} label={dataObjectRow.date.split("T")[0]} >
                        <TreeItem nodeId={"rapports".concat(indexP)} label="Rapports">
                            {dataObjectRow.rapport.map((objectRow, indexC) => (
                                <div>
                                    <TreeItem nodeId={dataObjectRow._id.concat("/"+objectRow._id)} label={objectRow.name} />
                                </div>
                            ))}
                        </TreeItem>
                        <TreeItem nodeId={"annexes".concat(indexP)} label="Annexes">
                            {dataObjectRow.annexe.map((objectRow, indexC) => (
                                <div>
                                    <TreeItem nodeId={dataObjectRow._id.concat("/"+objectRow._id)} label={objectRow.name} />
                                </div>
                            ))}
                        </TreeItem>

                    </TreeItem>
                ))}

            </TreeView>

        </div>


    );
};

export default ArchiveTree;