import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';

const urlCreator = window.URL || window.webkitURL;

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            hasImage: false,
            imageUrl: '',
            fileUrl: '',
            file:null,
            result: ""
        };
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        console.log(value+" AND "+name);
        var hasImage = this.state.hasImage;
        hasImage = value != '';
        this.setState({
            hasImage,
            fileUrl: URL.createObjectURL(event.target.files[0]),
            file:event.target.files[0],
        });
    }

    handlePredictClick = (event) => {
        const file = this.state.file;

        const data = new FormData();
        data.append('file', file);

        this.setState({ isLoading: true });
        fetch('http://127.0.0.1:5000/prediction/',
            {
                method: 'POST',
                body: data
            })
            // .then(response => response.json())
            .then(response => {
                response.blob().
                then(blobResponse => {
                    this.setState({
                        // result: response.result,
                        image: blobResponse,
                        isLoading: false
                    });
                })
            });
    }

    handleCancelClick = (event) => {
        this.setState({ result: "", hasImage: false, formData:{city_img:''},image:null});
    }

    render() {
        const hasImage = this.state.hasImage;
        const isLoading = this.state.isLoading;
        const imageUrl = this.state.imageUrl;
        const result = this.state.result;
        const fileUrl = this.state.fileUrl;

        return (
            <Container>
                <div>
                    <h3 className="title">Proto Type</h3>
                </div>
                <div className="content">
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Upload Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    //   placeholder="Text Field 1"
                                    name="image"
                                    value={imageUrl}
                                    onChange={this.handleChange} />
                            </Form.Group>
                        </Form.Row>
                        <Row style={{padding:"16px 0px"}}>
                            { hasImage ?
                                <Col>
                                    <Image height={300} width={300} src={fileUrl} />
                                </Col> : null }
                            <Col>
                                <Container>
                                    <Row>
                                        <Button
                                            block
                                            variant="success"
                                            disabled={isLoading}
                                            onClick={!isLoading ? this.handlePredictClick : null}>
                                            { isLoading ? 'Making prediction' : 'Predict' }
                                        </Button>
                                    </Row>
                                    <Row>
                                        <Button
                                            block
                                            variant="danger"
                                            disabled={isLoading}
                                            onClick={this.handleCancelClick}>
                                            Reset prediction
                                        </Button>
                                    </Row>
                                </Container>
                            </Col>
                        </Row>


                    </Form>
                    {result === "" ? null :
                        (<Row>
                            <Col className="result-container">
                                <h5 id="result">{result}</h5>
                            </Col>
                        </Row>)
                    }
                    {
                        !this.state.isLoading && this.state.image?

                            <Row style={{padding:"16px 0px"}}>
                                <Col>
                                    <Image height={300} width={300} src={urlCreator.createObjectURL(this.state.image)} />
                                </Col>
                            </Row>
                            :
                            <></>
                    }
                </div>
            </Container>
        );
    }
}

export default App;