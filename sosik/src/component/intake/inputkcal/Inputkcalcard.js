import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./inputkcal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger } from "react-bootstrap";
import RenderTooltip from "./RenderTooltip";

function Inputkcalcard() {
  const [todayTargetKcal, setTodayTargetkcal] = useState({
    dayTargetKcal: 0,
  });
  const [managementData, setManagementData] = useState({
    tdeeCalculation: 0,
    currentWeight: 0,
    managementWeek: 0,
    targetWeight: 0,
  });

  const [createTodayTargetKcal, setCreateTodayKcal] = useState({
    dayTargetKcal: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateTodayKcal({ ...createTodayTargetKcal, [name]: value });
    console.log(value);
  };

  const getTodayTargetCalorie = async () => {
    const authorization = JSON.parse(localStorage.getItem("accesstoken"));
    const refreshToken = JSON.parse(localStorage.getItem("refreshtoken"));

    let today = new Date();
    today = today.toISOString();
    today = today.split("T")[0];

    console.log(today);

    try {
      await axios({
        method: "get",
        url: "http://localhost:5056/target-calorie/v1/" + today,
        headers: {
          authorization: authorization,
          refreshToken: refreshToken,
          "Content-Type": "application/json",
        },
      }).then((response) => {
        console.log(response);
        console.log(response.data.result);
        setTodayTargetkcal(response.data.result);
      });
    } catch (e) {
      console.log(e);
    }
  };
  const getManagementData = async () => {
    const authorization = JSON.parse(localStorage.getItem("accesstoken"));
    const refreshToken = JSON.parse(localStorage.getItem("refreshtoken"));

    try {
      await axios({
        method: "get",
        url: "http://localhost:5056/members/v1/managementData",
        headers: {
          authorization: authorization,
          refreshToken: refreshToken,
          "Content-Type": "application/json",
        },
      }).then((response) => {
        console.log(response);
        console.log(response.data.result);
        setManagementData(response.data.result);
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getTodayTargetCalorie();
    getManagementData();
  }, []);
  const handleOnModify = async (e) => {
    try {
      const authorization = JSON.parse(localStorage.getItem("accesstoken"));
      const refreshToken = JSON.parse(localStorage.getItem("refreshtoken"));
      console.log(createTodayTargetKcal);
      const requestTargetCalorie = createTodayTargetKcal;
      console.log(requestTargetCalorie);
      await axios
        .post(
          "http://localhost:5056/target-calorie/v1/",
          requestTargetCalorie,
          {
            headers: {
              authorization: authorization,
              refreshToken: refreshToken,
            },
          }
        )
        .then((result) => {
          alert("목표칼로리 기입에 성공하였습니다.");
          window.location.reload();
        });
    } catch (error) {}
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (todayTargetKcal === null) {
      try {
        const authorization = JSON.parse(localStorage.getItem("accesstoken"));
        const refreshToken = JSON.parse(localStorage.getItem("refreshtoken"));
        console.log(createTodayTargetKcal);
        const requestTargetCalorie = createTodayTargetKcal;
        console.log(requestTargetCalorie);
        await axios
          .post(
            "http://localhost:5056/target-calorie/v1/",
            requestTargetCalorie,
            {
              headers: {
                authorization: authorization,
                refreshToken: refreshToken,
              },
            }
          )
          .then((result) => {
            alert("목표칼로리 기입에 성공하였습니다.");
            window.location.reload();
          });
      } catch (error) {}
      console.log("Submit for Registration");
    } else {
      console.log("Submit for Modification");
      handleOnModify(); // 수정 버튼일 경우 handleOnModify 호출
    }
  };

  return (
    <Card
      bg={"white".toLowerCase()}
      key={"white"}
      text={"white".toLowerCase() === "dark"}
      className="inputkcalcard mb-2"
    >
      <Card.Body>
        <Card.Title className="inputkcalcardtitle mb-2">
          오늘의 목표칼로리
          <OverlayTrigger
            placement="right"
            delay={{ show: 100, hide: 300 }}
            overlay={RenderTooltip(managementData)}
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </OverlayTrigger>
        </Card.Title>

        <Card.Text>
          <Form onSubmit={handleOnSubmit}>
            <div className="d-flex">
              <Form.Control
                type="text"
                name="dayTargetKcal"
                className="kcalform mr-2"
                onChange={handleInputChange}
                placeholder={
                  todayTargetKcal == null ? 0 : todayTargetKcal.dayTargetKcal
                }
              />
              <span className="kcal">kcal</span>
            </div>
            {todayTargetKcal === null ? (
              <Button type="submit" variant="success" className="kcalbutton">
                등록
              </Button>
            ) : (
              <Button type="submit" variant="success" className="kcalbutton">
                수정
              </Button>
            )}
          </Form>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Inputkcalcard;
