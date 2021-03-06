import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import CloseXIcon from "../../public/static/svg/modal/modal_close_x_icon.svg";
import MailIcon from "../../public/static/svg/input/mail.svg";
import PersonIcon from "../../public/static/svg/input/person.svg";
import OpenedEyeIcon from "../../public/static/svg/input/opened-eye.svg";
import ClosedEyeIcon from "../../public/static/svg/input/closed_eye.svg";
import palette from "../../styles/palette";
import Input from "../common/Input";
import { userInfo } from "os";
import { monthList, dayList, yearList } from "../../lib/staticData";
import Selector from "../common/selector";
import Button from "../common/Button";
import { signupAPI } from "../../lib/api/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user";
import useValidateMode from "../../hooks/useValidateMode";
import PasswordWarning from "./PasswordWarning";


const Container = styled.div`
	width: 568px;
	height: 614px;
  padding: 32px;
	background-color: white;
	z-index: 11;

  .modal-close-x-icon {
    cursor: pointer;
    display: block;
    margin: 0 0 40px auto;
  }

  .input-wrapper{
    position: relative;
    margin-bottom: 16px;

    svg {
      position: absolute;
      right: 11px;
      top: 16px;
    }
  }

  .sign-up-password-input-wrapper{
    svg{
      cursor:pointer;
    }
  }

  .sign-up-birthday-label {
    font-size: 16px;
    font-weight: 600;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  .sign-up-modal-birthday-info {
    margin-bottom: 16px;
    color: ${palette.charcoal};
  }
  
  .sign-up-modal-birthday-selectors {
    display: flex;
    margin-bottom: 24px;
    .sign-up-modal-birthday-month-selector {
      margin-right: 16px;
      flex-grow: 1;
    }
    .sign-up-modal-birthday-day-selector {
      margin-right: 16px;
      width: 25%;
    }
    .sign-up-modal-birthday-year-selector {
      width: 33.3333%;
    }
  }

  .sign-up-modal-submit-button-wrapper {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${palette.gray_eb};
  }
`;

const PASSWORD_MIN_LENGTH = 8;

interface IProps {
  closeModal: () => void;

}

const SignUpModal: React.FC<IProps> = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [birthYear, setBirthYear] = useState<string | undefined>();
  const [birthDay, setBirthDay] = useState<string | undefined>();
  const [birthMonth, setBirthMonth] = useState<string | undefined>();
  const [passwordFocused, setPasswordFocused] = useState(false);


  //* ???????????? ??? ?????????
  const onChangeBirthMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthMonth(event.target.value);
  };

  //* ???????????? ??? ?????? ???
  const onChangeBirthDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthDay(event.target.value);
  }

  //* ???????????? ??? ?????? ???
  const onChangeBirthYear = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthYear(event.target.value);
  }

  //* ????????? ?????? ?????? ???
  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangeLastname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(event.target.value);
  };

  const onChangeFirstname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstname(event.target.value);
  };

  const onChangePassword = (enver: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  const dispatch = useDispatch();
  const { validateMode, setValidateMode } = useValidateMode();

  const onFocusPassword = () => {
    setPasswordFocused(true);
  };

  //* password??? ???????????? ???????????? ???????????????
  const isPasswordHasNameOrEmail = useMemo(
    () =>
      !password ||
      !lastname ||
      password.includes(lastname) ||
      password.includes(email.split("@")[0]),
    [password, lastname, email]
  );

  const isPasswordOverMinLength = useMemo(
    () => !!password && password.length >= PASSWORD_MIN_LENGTH,
    [password]
  );

  //* ??????????????? ????????? ??????????????? ???????????????
  const isPasswordHasNumberOrSymbol = useMemo(
    () =>
      /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/g.test(password) ||
      /[0-9]/g.test(password),
    [password]
  );

  //* ????????? ??????????????? ?????? ??????
  const validateSignUpForm = () => {
    if (!email) {
      return false;
    }
    if (!lastname) {
      return false;
    }
    if (!firstname) {
      return false;
    }
    if (!birthMonth) {
      return false;
    }
    if (!birthDay) {
      return false;
    }
    if (!birthYear) {
      return false;
    }
    if (
      !password ||
      isPasswordHasNameOrEmail ||
      !isPasswordHasNumberOrSymbol ||
      !isPasswordOverMinLength
    ) {
      return false;
    }
    return true;
  };

  //* ???????????? ?????? ???
  const onSubmitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidateMode(true);
    console.log(validateSignUpForm());

    if (validateSignUpForm()) {
      try {
        const signUpBody = {
          email,
          lastname,
          firstname,
          password,
          birthday: new Date(
            `${birthYear}-${birthMonth!.replace("???", "")}-${birthDay}`
          ).toISOString(),
        };
        const { data } = await signupAPI(signUpBody);
        dispatch(userActions.setUser(data));
        //        dispatch(userActions.setLoggedUser(data));

        closeModal();
        console.log("data: ", data);
      } catch (e) {
        console.log(e);
      }

    }
  };

  useEffect(() => {
    setValidateMode(false);
  }, []);


  return (
    <Container>
      <form onSubmit={onSubmitSignUp}>
        <CloseXIcon className="modal-close-x-icon" />
        <div className="input-wrapper">
          <Input
            name="email"
            placeholder="????????? ??????"
            type="email"
            icon={<MailIcon />}
            value={email}
            onChange={onChangeEmail}
            useValidation
            isValid={!!email}
            errorMessage="???????????? ???????????????."
          />
        </div>
        <div className="input-wrapper">
          <Input
            placeholder="??????(???:??????)"
            icon={<PersonIcon />}
            value={lastname}
            isValid={!!lastname}
            useValidation
            onChange={onChangeLastname}
            errorMessage="????????? ???????????????."
          />
        </div>
        <div className="input-wrapper">
          <Input
            placeholder="???(???: ???)"
            icon={<PersonIcon />}
            value={firstname}
            onChange={onChangeFirstname}
            useValidation
            isValid={!!firstname}
            errorMessage="?????? ???????????????."
          />
        </div>
        <div className="input-wrapper sign-up-password-input-wrapper">
          <Input
            placeholder="???????????? ????????????"
            type={hidePassword ? "password" : "text"}
            icon={
              hidePassword ? (
                <ClosedEyeIcon onClick={toggleHidePassword} />
              ) : (
                <OpenedEyeIcon onClick={toggleHidePassword} />
              )
            }
            value={password}
            onChange={onChangePassword}
            useValidation
            isValid={
              !isPasswordHasNameOrEmail && isPasswordOverMinLength && !isPasswordHasNumberOrSymbol
            }
            errorMessage="??????????????? ???????????????"
            onFocus={onFocusPassword}
          />
        </div>
        {passwordFocused && (
          <>
            <PasswordWarning
              isValid={!isPasswordHasNameOrEmail}
              errorMessage="??????????????? ?????? ???????????? ????????? ????????? ????????? ??? ????????????."
            />
            <PasswordWarning
              isValid={isPasswordOverMinLength}
              errorMessage="?????? 8???" />
            <PasswordWarning
              isValid={isPasswordHasNumberOrSymbol}
              errorMessage="????????? ????????? ???????????????"
            />
          </>
        )}
        <p className="sign-up-birthday-label">??????</p>
        <p className="sign-up-modal-birthday-info">
          ??? 18??? ????????? ????????? ???????????? ????????? ??? ????????????. ????????? ?????? ??????????????? ??????????????? ???????????? ????????????.
        </p>
        <div className="sign-up-modal-birthday-selectors">
          <div className="sign-up-modal-birthday-month-selector">
            <Selector
              options={monthList}
              disabledOptions={["???"]}
              defaultValue="???"
              value={birthMonth}
              onChange={onChangeBirthMonth}
              isValid={!!birthMonth}
            />
          </div>
          <div className="sign-up-modal-birthday-day-selector">
            <Selector
              options={dayList}
              disabledOptions={["???"]}
              defaultValue="???"
              value={birthDay}
              onChange={onChangeBirthDay}
              isValid={!!birthDay}
            />
          </div>
          <div className="sign-up-modal-birthday-year-selector">
            <Selector
              options={yearList}
              disabledOptions={["???"]}
              defaultValue="???"
              value={birthYear}
              onChange={onChangeBirthYear}
              isValid={!!birthYear}
            />
          </div>
        </div>
        <div className="sign-up-modal-submit-button-wrapper">
          <Button type="submit">????????????</Button>
        </div>
        <p>
          ?????? ??????????????? ????????? ??????????
          <span
            className="sign-up-modal-set-login"
            role="presentation"
            onClick={() => dispatch(authActions.setAuthMode("login"))}
          >
            ?????????
          </span>
        </p>
      </form>
    </Container>
  );
};

export default SignUpModal;