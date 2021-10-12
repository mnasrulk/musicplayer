import React from "react";
import { func, string } from "prop-types";
import { ToggleContainer } from "./styled";
//import styled from "styled-components";

import { ReactComponent as BulbOnIcon } from "./bulbon.svg";
import { ReactComponent as BulbOffIcon } from "./bulboff.svg";

const Toggle = ({ theme, toggleTheme}) => {
    const isLight = theme === "light";
    return (
        <ToggleContainer lightTheme={isLight} onClick={toggleTheme}>
            <BulbOnIcon />
            <BulbOffIcon />
            <p>{theme}</p>
        </ToggleContainer>
    );
};

Toggle.propTypes = {
    theme: string.isRequired,
    toggleTheme: func.isRequired,
};

export default Toggle;