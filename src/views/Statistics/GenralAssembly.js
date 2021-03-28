/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";
import { encode, decode } from 'uint8-to-base64';
import ArchiveTable from "../components/ArchiveTable";

const GenralAssembly = () => {
    const { ApiServices } = useContext(AppContext);
    const { pvUploadService, teamService } = ApiServices;
    const [pvs, setPvs] = useState([])
   
    const columns2 = ["date", "rapport", "annexe"];
    const inputsSkeleton2 = [
        { name: "date", label: columns2[0], type: "input" },
        { name: "rapport", label: columns2[1], type: "input" },
        { name: "annexe", label: columns2[2], type: "input" },
    ];

    const updatePvData = useCallback(async () => {
        const teamId = JSON.parse(localStorage.getItem("user")).teamsMemberships[0].team_id ;
        
        try {
            const teamsResponse = await teamService.findTeam(teamId);
            const response = await pvUploadService.findAllPvs();
            const filtredPvs = response.data.filter(pv => pv.laboratory_id===teamsResponse.data.laboratory_id);
            console.log(filtredPvs)
            if (response.data) {
                setPvs(filtredPvs);

            }
            else throw Error();
        } catch (error) {
            console.log(error)
        }
    }, []);


    const downloadAnnexe = async (pv) => {
        try {
            const response = await pvUploadService.findPv(pv._id);

            if (response.data) {
           
                const encoded = encode(response.data.annexe.data.data);

                const byteCharacters = atob(encoded);
                const byteArrays = [];
                const sliceSize = 512;
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize);

                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                const blob = new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const downloadRapport = async (pv) => {
        try {
            const response = await pvUploadService.findPv(pv._id);

            if (response.data) {
                const encoded = encode(response.data.rapport.data.data);
                var byteCharacters = atob(encoded);
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var file = new Blob([byteArray], { type: 'application/pdf;base64' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }

        } catch (error) {
            console.log(error)
        }
    }
    


    useEffect(() => {
        updatePvData();
    }, [updatePvData]);

    return (
        <Fragment>
            <div className="page-header">
                <PageHeader
                    title={`Consultation des PVs `}
                    subTitle={`${pvs.length} procédés verbaux`}
                />
            </div>
            <div className="row row-cards row-deck">
                
                    <ArchiveTable
                        columns={columns2}
                        data={pvs}
                        tableSkeleton={inputsSkeleton2}
                        actions={[
                            { name: "Rapport", function: downloadRapport, style: "danger" },
                            { name: "Annexe", function: downloadAnnexe, style: "success" },
                        ]}
                    />

            </div>
        </Fragment>
    );
};


export default GenralAssembly;
