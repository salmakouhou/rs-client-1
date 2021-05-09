import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import CreatableSelect from 'react-select/creatable';
import Lottie from 'react-lottie';
import check from '../../lottie/52961-check-outline.json';
import error from '../../lottie/lf30_editor_kysotdgo.json';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const BudgetDetails = (props) => {
    const { show, hideModal, labBudget, setInputs, verifyBudget, setCats, cats,sum,setSum,result,setResult } = props;

    const defaultOptionsLottieCkeck = {
        loop: false,
        autoplay: true,
        animationData: check,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    const defaultOptionsLottieError = {
        loop: false,
        autoplay: true,
        animationData: error,
    };

    const handleInputsChange = (event) => {
        event.persist();

        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: parseInt(event.target.value),
        }));
    };

    const createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });

    const defaultOptions = [
        createOption('One'),
        createOption('Two'),
        createOption('Three'),
    ];

    const handleChange = (newValue, actionMeta) => {
        setCats(newValue);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        var sumToVerify = verifyBudget();
        setSum(sumToVerify)
        if (sumToVerify > labBudget.budget) {
            setResult(false);
        } else {
            setResult(true);
        }
    }

    return (
        show && (
            <form onSubmit={handleSubmit}>
                <Modal
                    show={true}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton onClick={hideModal}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Verification du budget pour l'année  {labBudget.year}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row container">
                            <div className="col-6">
                                <CreatableSelect
                                    isMulti
                                    onChange={handleChange}
                                    options={defaultOptions}
                                />
                                <h4 style={{ margin: "10px" }}>Le budget total à ne pas dépasser: {labBudget.budget} DH</h4>
                                <table className="table card-table table-vcenter text-nowrap datatable">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Catégorie</th>
                                            <th className="text-left">Somme</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cats.map((e, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td> {e.label}</td>
                                                    <td key={index}><input onChange={handleInputsChange} name={e.label} className="form-controll" /></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className=" col-6 " align="center">
                                {(result ?
                                    <div className="" >
                                        <Lottie
                                            options={defaultOptionsLottieCkeck}
                                            height={200}
                                            width={200}
                                        />
                                        <h3>{sum} DH {"< ".concat(labBudget.budget)} DH </h3>
                                    </div>
                                    :
                                    <div className="">
                                        <Lottie
                                            options={defaultOptionsLottieError}
                                            height={200}
                                            width={200}
                                        />
                                        <h3>{sum} DH {"> ".concat(labBudget.budget)} DH </h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>

                        <Button size="small" onClick={handleSubmit} variant="contained" color="primary">Vérifier</Button>

                        <Button size="small" style={{ marginLeft: "5px" }} onClick={hideModal} variant="contained" color="secondary">Fermer</Button>

                    </Modal.Footer>
                </Modal>
            </form>


        )
    )
};

export default BudgetDetails;