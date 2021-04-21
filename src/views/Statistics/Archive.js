/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import ArchivageFORM from '../components/ArchivageFORM';
import { AppContext } from "../../context/AppContext";
import { encode, decode } from 'uint8-to-base64';
import ArchiveTable from "../components/ArchiveTable";
import swal from 'sweetalert';
import ArchiveTree from "../components/ArchiveTree";


const Archive = () => {
    const { ApiServices } = useContext(AppContext);
    const { pvUploadService } = ApiServices;
    const [pvs, setPvs] = useState([])

    const [inputs, setInputs] = useState({});
    const [action, setAction] = useState("ADDING");

    const columns = ["Date du PV", "Joindre le rapport", "Joidre les annexes"];
    const inputsSkeleton = [
        { name: "date", label: columns[0], type: "date" },
        { name: "file", label: columns[1], type: "file" },
        { name: "file", label: columns[2], type: "file" },
    ];





    const updatePvData = useCallback(async () => {
        const connectedUser = JSON.parse(localStorage.getItem("user"));

        try {
            const response = await pvUploadService.findAllPvs(connectedUser.laboratoriesHeaded[0]._id);
            if (response.data) {
                setPvs(
                    response.data.sort(compare).map((pv) => ({
                        ...pv,
                        pv: pv,
                    }))
                );

            }
            else throw Error();
        } catch (error) {
            console.log(error)
        }
    }, []);

    const  compare=( a, b )=> {
        if ( a.date < b.date ){
          return 1;
        }
        if ( a.date > b.date ){
          return -1;
        }
        return 0;
      }

    const addPv = async () => {
        try {
            swal({
                title: "Confirmation",
                text: "Etes vous sur de vouloir ajouter cet procès verbale?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const laboratoryId = JSON.parse(localStorage.getItem("user")).laboratoriesHeaded[0]._id;
                        const formData = new FormData();
                        var keys = Object.keys(inputs);
                        keys.forEach((key) => {
                            formData.append(key, inputs[key])
                            console.log(key + " ====>")
                            console.log(inputs[key])
                        })

                        formData.append('laboratory_id', laboratoryId);
                        const response = await pvUploadService.createPv(formData);

                        swal("Le procès verbale à été ajouter avec succès", {
                            icon: "success",
                        });
                        if (response.data) {
                            updatePvData();
                            clearInputs();
                        }
                        else throw Error();
                    } catch (error) {

                    }
                } else {
                    swal("Abortion du transaction!");
                }
            });
        } catch (error) {
            console.log(error)
        }


    };

    const deletePv = async (_id) => {
        
       try {

            swal({
                title: "Confirmation",
                text: "Etes vous sur de vouloir supprimer cet procès verbale?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    const response = await pvUploadService.deletePv(_id);
                    if (response.data) updatePvData();
                    else throw Error();
                    swal("Le procès verbale à été supprimer avec succès", {
                        icon: "success",
                    });
                } else {
                    swal("Abortion du transaction!");
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    

    const downloadRapport = async (pv) => {
        try {
            console.log(pv.split("/")[0])
            const response = await pvUploadService.findPv(pv.split("/")[0], pv.split("/")[1]);

            if (response.data) {
                const encoded = encode(response.data.data);
                var byteCharacters = atob(encoded);
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var file = new Blob([byteArray], { type: response.data.mimetype });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }


        } catch (error) {

            console.log(error)
        }
    }


    const clearInputs = () => {
        setInputs(() => ({
            date: "",
            pv: "",
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        return action === "ADDING"
            ? addPv()
            : action === "EDITING"
                ? updatePv()
                : updatePvData();
    };

    const updatePv = () => {
        console.log("updating")
    }


    useEffect(() => {
        updatePvData();
        clearInputs();
    }, [updatePvData]);

    /**     * <ArchiveTable
                            columns={columns2}
                            data={pvs}
                            tableSkeleton={inputsSkeleton2}
                            actions={[
                                { name: "Rapport", function: downloadRapport, style: "danger" },
                                { name: "Annexe", function: downloadAnnexe, style: "success" },
                                { name: "Supprimer", function: deletePv, style: "danger" },
    
                            ]}
                        />
     */


    return (
        <Fragment>
            <div className="page-header">
                <PageHeader
                    title={`Archivage des PVs `}
                    subTitle={`${pvs.length} procédés verbaux`}
                />
            </div>
            <div className="row row-cards row-deck">
                <div className="col-md-6">
                    <ArchivageFORM
                        {...{
                            inputs,
                            setInputs,
                            inputsSkeleton,
                            handleSubmit,
                            action,
                        }}
                    />

                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Les Pvs</h3>
                        </div>
                        <div className={`card-body form `}>
                            <ArchiveTree data={pvs}
                                downloadRapport={downloadRapport}
                                deletePv={deletePv} />

                        </div>
                    </div>
                </div>

            </div>
        </Fragment>
    );
};


export default Archive;
