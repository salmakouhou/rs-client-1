/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useContext,
  useState,
  Fragment,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Publications from "../Author/components/Publications";
import AuthorCitations from "../Author/components/AuthorCitations";
import Coauthors from "../Author/components/Coauthors";
import ProfileHeader from "./components/ProfileHeader";

const Profile = () => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [correspondingFollowedUser, setCorrespondingFollowedUser] = useState(
    null
  );
  const [correspondingFollowedUserCitation, setCorrespondingFollowedUserCitation] = useState(
    null
  );
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService,scraperService } = ApiServices;

  useEffect(() => {
    getProfile();
    updateCitation();
  }, [id]);

  const getProfile = useCallback(async () => {
    try {
      const response = await userService.findUser(id);
      if (response.data) {
        setProfileUser(response.data);
        setCorrespondingFollowedUser(response.data.correspondingFollowedUser);
        setCorrespondingFollowedUserCitation(response.data.correspondingFollowedUser);
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de profil" });
    }
  }, [id]);


  const updateCitation = useCallback(async () => {
    try {
      const response = await userService.findUser(id);
      const journalName = response.data.correspondingFollowedUser.publications[6].source
      ? response.data.correspondingFollowedUser.publications[0].source
      : response.data.correspondingFollowedUser.publications[0].extraInformation && response.data.correspondingFollowedUser.publications[0].extraInformation["Journal"]
      ? response.data.correspondingFollowedUser.publications[0].extraInformation["Journal"]
      : null;

      const journalNameQuery = journalName.replace("/", "").replace("\\", "");

      const response1 = await scraperService.getJournalData(
        journalNameQuery,
        "2019"
      );
      console.log(response1)


      var url="";
      const responseScrap = await scraperService.getAuthorData(response.data.correspondingFollowedUser.platform, response.data.correspondingFollowedUser.authorId);
      for(var i=0;i<response.data.correspondingFollowedUser.publications.length;i++){
        if (response.data.correspondingFollowedUser.publications[i].IF=!undefined  && !(response.data.correspondingFollowedUser.publications[i].IF==null)){
          url="";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Mobile Information Systems"){
          console.log("hhhheeeheehhhehehehehloo"+response.data.correspondingFollowedUser.publications[i].IF)
          url="MOB-INF-SYST";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Intelligent Automation and Soft Computing"){
          url="INTELL-AUTOM-SOFT-CO";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Surfaces and Interfaces"){
          url="SURF-INTERFACE-ANAL";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Hydrogen Energy"){
          url="INT-J-HYDROGEN-ENERG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Sensors and Actuators, A: Physical"){
          url="SENSOR-ACTUAT-A-PHYS";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Environmental Science and Pollution Research"){
          url="ENVIRON-SCI-POLLUT-R";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Energy Research"){
          url="INT-J-ENERG-RES";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="Computer Speech and Language"){
          url="COMPUT-SPEECH-LANG";
        }else if (response.data.correspondingFollowedUser.publications[i].source=="International Journal of Electrical and Computer Engineering"){
          url="COMPUT-ELECTR-ENG";
        }else{url=""}
        if(url!=""){
          var IF="";
          var annee=response.data.correspondingFollowedUser.publications[i].year;
        
          var IFScraper=await scraperService.getIFData(url);
          for(var j=0;j<IFScraper.data.author.name[0].year.length;j++){
            if(IFScraper.data.author.name[0].year[j]==annee){
              IF=IFScraper.data.author.name[0].IF[j];
              console.log("iiiiffff"+IF);
              const responseDB=userService.addIF({
                id:response.data.correspondingFollowedUser.user_id,
                title:response.data.correspondingFollowedUser.publications[i].title,
                IF: IF,
              
              })
            }
          }
 
          

        }
      }

      if (responseScrap.data.author) {
        console.log(responseScrap.data.author.citationsPerYear.length);
        console.log(response.data.correspondingFollowedUser.citationsPerYear.length);

        if(responseScrap.data.author.citationsPerYear.length>response.data.correspondingFollowedUser.citationsPerYear.length){
          userService.updateCitation(responseScrap.data.author);
          setCorrespondingFollowedUserCitation(responseScrap.data.author);

        }else if(responseScrap.data.author.citationsPerYear[responseScrap.data.author.citationsPerYear.length-1]!=response.data.correspondingFollowedUser.citationsPerYear[responseScrap.data.author.citationsPerYear.length-1]){
          userService.updateCitation(responseScrap.data.author);
          setCorrespondingFollowedUserCitation(responseScrap.data.author);
        }
       
      } 
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de profil" });
    }
  }, [id]);

  return (
    <div className="container">
      {profileUser !== null && (
        <Fragment>
          {correspondingFollowedUser != null && correspondingFollowedUserCitation != null && (
            <div className="row">
              <div className="col-md-8">
                {correspondingFollowedUser != null && correspondingFollowedUserCitation != null && (
                  <Fragment>
                    <ProfileHeader
                      profile={{
                        ...correspondingFollowedUser,
                        ...profileUser,
                      }}
                    />
                    <Publications
                      author={correspondingFollowedUser}
                      setAuthor={setCorrespondingFollowedUser}
                      getProfile={getProfile}
                    />
                  </Fragment>
                )}
              </div>
              <div className="col-md-4">
                <AuthorCitations author={correspondingFollowedUserCitation} />
                <Coauthors author={correspondingFollowedUser} />
              </div>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Profile;
