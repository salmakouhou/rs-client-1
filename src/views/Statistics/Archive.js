/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import ArchivageFORM from '../components/ArchivageFORM';
const Archive = () => {

    const [inputs, setInputs] = useState({});
    const [action, setAction] = useState("ADDING");

    const columns = ["Date du PV", "Joindre le PV"];
    const inputsSkeleton = [
        { name: "date", label: columns[0], type: "date" },
        { name: "pv", label: columns[1], type: "file" },

    ];

    const cancelEdit = () => {
        clearInputs();
        setAction("ADDING");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        
    };
    const clearInputs = () => {
        setInputs(() => ({
            date: "",
            pv: "",
        }));
    };

    return (
        <Fragment>
            <div className="page-header">
                <PageHeader
                    title={`Archivage des PVs `}
                />
            </div>
            <div className="row row-cards row-deck">
                <div className="col-md-8">
                    <ArchivageFORM
                        {...{
                            inputs,
                            setInputs,
                            inputsSkeleton,
                            handleSubmit,
                            cancelEdit,
                            action,
                        }}
                    />
                </div>
                <div className="col-md-4">


                </div>
            </div>
        </Fragment>
    );
};


export default Archive;
