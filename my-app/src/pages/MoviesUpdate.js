import React, { Component } from "react";
import api from "../api";

import styled from "styled-components";

const Title = styled.h1.attrs({
  className: "h1",
})``;

const Wrapper = styled.div.attrs({
  className: "form-group",
})`
  margin: 0 30px;
`;

const Label = styled.label`
  margin: 5px;
`;

const InputText = styled.input.attrs({
  className: "form-control",
})`
  margin: 5px;
`;

const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
`;

const CancelButton = styled.a.attrs({
  className: `btn btn-danger`,
})`
  margin: 15px 15px 15px 5px;
`;

class MoviesUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      title: "",
      releaseYear: "",
      format: "",
      stars: "",
    };
  }

  handleChangeInputTitle = async (event) => {
   const title = event.target.value;
   this.setState({ title });
 };

 handleChangeInputReleaseYear = async (event) => {
   const releaseYear = event.target.value;
   this.setState({ releaseYear });
 };

   
  
 handleChangeInputFormat = async (event) => {
   const format = event.target.value;
   this.setState({ format });
   };
   
   handleChangeInputStars = async (event) => {
      const stars = event.target.value;
      this.setState({ stars });
     };

  handleUpdateMovie = async () => {
    const { id, title, releaseYear, format, stars } = this.state;
    const payload = { title, releaseYear, format, stars: arrayTime };

    await api.updateMovieById(id, payload).then((res) => {
      window.alert(`Movie updated successfully`);
      this.setState({
        title: "",
        releaseYear: "",
         format: "",
        stars: "",
      });
    });
   };
   
  

  componentDidMount = async () => {
    const { id } = this.state;
    const movie = await api.getMovieById(id);

    this.setState({
      title: movie.data.data.title,
      releaseYear: movie.data.data.rating,
       format: movie.data.data.format,
       stars: movie.data.data.stars,
    });
  };

  render() {
    const { title, releaseYear, format, stars } = this.state;

    const generateYearRegex  = ([year,decade]) => new RegExp(`^(19\\d{2})|20[0-${decade-1}]\\d|20${decade}[0-${year}]$`);

const validators = {
    title:/^[\s\w,\.-]{1,50}$/,
    releaseYear: generateYearRegex(new Date().getFullYear().toString().split("").reverse()),
    format:/^[\w-]{2,15}$/,
    stars:/^[\sa-zA-Z,-]{3,200}$/,
    actor:/^[a-zA-Z-]{0,20}$/
};
    return (
      <Wrapper>
        <Title>Create Movie</Title>

        <Label>Title: </Label>
        <InputText
          type="text"
          value={title}
             onChange={this.handleChangeInputTitle}
             validations={{
               matchRegexp: validators.title
           }}
        />

        <Label>Release Year: </Label>
        <InputText
          type="number"
          value={releaseYear}
             onChange={this.handleChangeInputReleaseYear}
             validations={{
               matchRegexp: validators.releaseYear
           }}
        />

        <Label>Format: </Label>
        <InputText
          type="text"
          value={format}
             onChange={this.handleChangeInputFormat}
             validations={{
               matchRegexp: validators.format
           }}
        />
         <Label>Stars: </Label>
         <InputText
          type="text"
          value={stars}
           onChange={this.handleChangeInputStars}
          validations={{
            matchRegexp: validators.stars
        }}
        />

        <Button onClick={this.handleUpdateMovie}>Update Movie</Button>
        <CancelButton href={"/movies/list"}>Cancel</CancelButton>
      </Wrapper>
    );
  }
}

export default MoviesUpdate;