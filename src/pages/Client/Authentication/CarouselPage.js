import React from "react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Col } from "reactstrap"

const CarouselPage = () => {
  return (
    <React.Fragment>
      <Col xl={9}>
        <div className="auth-full-custom-bg pt-lg-5 p-4">
     
          <div className="w-100">
            <div className="bg-overlay"></div>
            <div id='stars'></div>
            <div id='stars2'></div>
            <div id='stars3'></div>
            <div className="d-flex h-100 flex-column">
              <div className="py-5 px-4 mt-auto">
                <div className="row justify-content-center">
                  <div className="col-lg-7">
                    <div className="text-center">
                      <h4 className="mb-1 text-white">
                        <i className="bx bxs-quote-alt-left text-primary h1 align-middle me-3"></i>
                        {/* <span className="text-primary">5k</span>+ Satisfied
                        clients */}
                      </h4>
                      <div dir="ltr">
                        <Carousel showThumbs={false} className="slider_css" dir="rtl">
                          <div>
                            <div className="item">
                              <div className="py-3">
                                <p className="font-size-16 mb-4 text-white">
                                  "Whatever questions or concerns you have in mind, 
                                   you can ask them through our Online Help Center and we will deliver the detailed answers.
                                   Besides, we also provide email support if you have any other queries.. "
                                </p>
                                <div>
                                  <h4 className="font-size-16 text-primary">
                                    {/* Abs1981 */}
                                </h4>
                                  <p className="font-size-14 text-white mb-0">
                                    - Epsylon Support
                                </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="item">
                              <div className="py-3">
                                <p className="font-size-16 text-white mb-4">
                                  "With 25 years of experience in the advertising industry, 
                                   our team has a deep understanding of what agencies need from their system.
                                   We will guide you through the implementation to ensure the system meets your agency’s needs"
                                </p>
                                <div>
                                  <h4 className="font-size-16 text-primary">
                                    {/* Abs1981 */}
                                </h4>
                                  <p className="font-size-14 text-white mb-0">
                                    - Epsylon Support
                                </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Carousel>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  )
}
export default CarouselPage
