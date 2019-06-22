class Swiper extends React.Component {
    constructor() {
      super();
      this.state = {
        xStart: undefined,
        xMove: undefined,
        shifted: 0,
        shiftedPrev: 0
      }
    };

    move(x) {
      requestAnimationFrame(() => {
        this.setState({
          shifted: x
        })
      })
    }

    onTouchStart = e => {
      this.setState({
        xStart: e.touches[0].clientX
      })
    };

    onTouchMove = e => {
      e.persist();

      const { clientX } = e.touches[0];
      const { swipeWidthLeft, swipeWidthRight } = this.props;

      this.setState(state => {
        const { xStart, xMove } = this.state;
        let shifted = xMove - xStart;

        if(shifted > 0) {
          // right
          shifted = Math.min(shifted, swipeWidthLeft)
        } else if (shifted < 0){
          // left
          shifted = Math.max(shifted, swipeWidthRight * -1)
        }
        this.move(shifted)
        return {
          xMove: clientX
        }
      })
    };

    onTouchEnd = e => {
      e.persist();
      const { swipeWidthLeft, swipeWidthRight, thresholdLeft, thresholdRight } = this.props;
      this.setState(state => {
        let { shifted } = state;

        if (shifted > 0 && shifted >= thresholdLeft) {
          shifted = swipeWidthLeft;
        } else if (shifted < 0 && shifted <= thresholdRight * -1) {
          shifted = swipeWidthRight * -1;
        } else {
          shifted = 0;
        }
        return {
          xStart: undefined,
          xMove: undefined,
      }})




    };

    render() {
      const { shifted } = this.state;
      const { swipeWidthLeft, swipeWidthRight } = this.props;

      return (
        <div className="swipe__container" onTouchStart={this.onTouchStart}  onTouchMove={this.onTouchMove}  onTouchEnd={this.onTouchEnd}>
          {this.props.renderLeft && (
            <div className="swipe__left" style={{
                width: `${swipeWidthLeft}px`,
              left: `${shifted - swipeWidthLeft}px`
            }}>
              {this.props.renderLeft()}
            </div>
          )}
          <div className="swipe__center" style={{
              left: `${shifted}px`
            }}>
            {this.props.children}
          </div>
          {this.props.renderRight && (
            <div className="swipe__right" style={{
                width: `${swipeWidthRight}px`,
              right: `${swipeWidthRight * -1 + shifted * -1}px`
            }}>
              {this.props.renderRight()}
            </div>
          )}
        </div>
      );
    }
  }

  class App extends React.Component {
    renderLeft() {
      return <div className="content green">l</div>
    }
    renderRight() {
      return <div className="content red">r</div>
    }
    render() {
      return (
        <div className="container">
          <Swiper swipeWidthLeft={100} swipeWidthRight={200} thresholdLeft={70} thresholdRight={200} renderLeft={this.renderLeft} renderRight={this.renderRight}>
            <div className="content coral">i like swiping</div>
          </Swiper>
        </div>
      );
    }
  }

  React.render(<App />, document.getElementById("app"));
