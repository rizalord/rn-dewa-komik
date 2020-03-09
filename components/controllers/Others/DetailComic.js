import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  BackHandler,
  AsyncStorage,
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyle from '../../assets/css/global';
import DetailComicLayout from '../../Views/Others/DetailComicLayout';
import {mobileApi} from '../../systems/config';
import {Database} from '../../systems/database';
import LoadingIndicator from '../../Views/components/LoadingIndicator';

export default class DetailComic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      id: props.navigation.state.params.mangaId,
      // id:   8,
      mangaData: null,
      loading: true,
      liked: false,
      bookmark: false,
      readedId: [],
      commentView: false,
      backening: false,
      commentLoading: true,
      commentData: [],
      commentText: '',
    };

    this.method = {
      getLikeStatus: this._getLikeStatus.bind(this),
      getBookmarkStatus: this._getBookmarkStatus.bind(this),
      likeFunc: this._likeFunc.bind(this),
      bookmarkFunc: this._bookmarkFunc.bind(this),
      getDetail: this._getDetailManga.bind(this),
      setReaded: this._setReaded.bind(this),
      setCommentState: this._setCommentState.bind(this),
      setCommentText: this._setCommentText.bind(this),
      sendComment: this._sendComment.bind(this),
    };
    this.onBackClick = this.onBackClick.bind(this);
    this.onBackClickPro = this.onBackClickPro.bind(this);
  }

  _sendComment() {
    if (this.state.commentText.trim() != '') {
      this._storeComment();
    }
  }

  async _storeComment() {
    const text = this.state.commentText.trim();
    const userId = await AsyncStorage.getItem('userId');
    const mangaId = this.state.mangaData.id_manga;

    this.setState(
      {
        commentText: '',
      },
      async () => {
        await Database.POST('comment', {
          text: text,
          mangaId: mangaId,
          userId: userId,
        })
          .then(async res => {
            if (res == true) {
              this.setState({
                commentData: [Database.data, ...this.state.commentData],
              });
            }
          });
      },
    );
  }

  _setCommentText(text) {
    this.setState({
      commentText: text,
    });
  }

  async getCommentData() {
    return await Database.GET('comment/' + this.state.mangaData.id_manga)
      .then(async res => {
        console.log(Database.data);
        await this.setState({
          commentData: Database.data,
        });

        return res;
      });
  }

  async _setCommentState() {
    if (this.state.commentLoading) {
      this.setState(
        {
          backening: !this.state.backening,
          commentView: !this.state.commentView,
        },
        async () => {
          // const getComment = await this.getCommentData();
          // console.log(getComment == 'object');
          await this.getCommentData()
          this.setState({
            commentLoading: false,
          });
        },
      );
    } else {
      this.setState({
        backening: !this.state.backening,
        commentView: !this.state.commentView,
      });
    }
  }

  componentDidMount() {
    this.method.getDetail();
    if (this.props.navigation.state.params.backprop != true) {
      BackHandler.addEventListener('hardwareBackPressed', this.onBackClick);
    } else {
      BackHandler.addEventListener('hardwareBackPressed', this.onBackClickPro);
    }
  }

  componentWillUnmount() {
    if (this.props.navigation.state.params.backprop != true) {
      BackHandler.removeEventListener('hardwareBackPressed', this.onBackClick);
    } else {
      BackHandler.removeEventListener(
        'hardwareBackPressed',
        this.onBackClickPro,
      );
    }
  }

  onBackClick() {
    this.props.navigation.goBack();
    if (this.props.navigation.state.params.forInject != undefined) {
      return true;
    }
    
    
  }

  onBackClickPro() {
      
    this.props.navigation.goBack();
    return true;
  }

  _setReaded(id) {
    let idOdd = this.state.readedId;
    idOdd.push(id);

    this.setState({
      readedId: idOdd,
    });
  }

  async _getReaded() {
    
    await AsyncStorage.getItem('readedId')
      .then(res => JSON.parse(res))
      .then(res => {
        this.setState({
          readedId: res == null ? [] : res,
        });
      });
  }

  _getDetailManga = async () => {
    await this._getReaded();
    Database.GET(`detail/${this.state.id}`)
      .then(async res => {
        if (this.state.mangaData != Database.data) {
          this.setState(
            {
              mangaData: Database.data,
            },
            async () => {
              await this.method.getLikeStatus();
              await this.method.getBookmarkStatus();
              this.setState({
                loading: false,
              });
            },
          );
        }  
      });

      
  };

  _getLikeStatus = async () => {
    await AsyncStorage.getItem('liked')
      .then(res => JSON.parse(res))
      .then(async res => {
        if (res != null) {
          if (res.includes(this.state.mangaData.id_manga)) {
            this.setState({
              liked: true,
            });
          }
        }
      });
  };

  _getBookmarkStatus = async () => {
    await AsyncStorage.getItem('bookmark')
      .then(res => JSON.parse(res))
      .then(async res => {
        if (res != null) {
          res.forEach(e => {
            if (e.id_manga == this.state.mangaData.id_manga) {
              this.setState({
                bookmark: true,
              });
            }
          });
          // if (res.includes(this.state.mangaData.id_manga)) {

          // }
        }
      });
  };

  _likeFunc = async () => {
    await AsyncStorage.getItem('liked')
      .then(res => JSON.parse(res))
      .then(async res => {
        if (res != null) {
          let data;
          if (res.includes(this.state.mangaData.id_manga)) {
            // hapus data
            data = res.filter(e => e != this.state.mangaData.id_manga);
          } else {
            // tambah data
            data = [...res, this.state.mangaData.id_manga];
          }
          await AsyncStorage.setItem('liked', JSON.stringify(data));
        } else {
          let data = [];
          data.push(this.state.mangaData.id_manga);
          await AsyncStorage.setItem('liked', JSON.stringify(data));
        }
        this._postReaction(this.state.mangaData.id_manga, 'like');
        this.setState({
          liked: !this.state.liked,
        });
      });
  };

  _bookmarkFunc = async () => {
    await AsyncStorage.getItem('bookmark')
      .then(res => JSON.parse(res))
      .then(async res => {
        if (res != null) {
          let data;
          let found = false;

          res.forEach(async e => {
            if (e.id_manga == this.state.mangaData.id_manga) {
              found = true;
            }
          });

          if (found) {
            // hapus data
            data = res.filter(e => e.id_manga != this.state.mangaData.id_manga);
          } else {
            // tambah data
            data = [...res, this.state.mangaData];
          }

          await AsyncStorage.setItem('bookmark', JSON.stringify(data));
        } else {
          let data = [];
          data.push(this.state.mangaData);
          await AsyncStorage.setItem('bookmark', JSON.stringify(data));
        }

        await this._postReaction(this.state.mangaData.id_manga, 'bookmark');
        this.setState({
          bookmark: !this.state.bookmark,
        });
      });
  };

  _postReaction = async (idManga, reaction) => {
    let userId;
    await AsyncStorage.getItem('userId').then(res => (userId = res));

    Database.POST(`user/${reaction == 'like' ? 'like' : 'bookmark'}`, {
      userId: userId,
      idManga: idManga
    })
      .then(res => {
        
      });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {!this.state.loading ? (
          <DetailComicLayout
            method={this.method}
            bookmarked={this.state.bookmark}
            liked={this.state.liked}
            data={this.state.mangaData}
            navigation={this.props.navigation}
            readedId={this.state.readedId}
            commentLoading={this.state.commentLoading}
            comment={{
              commentView: this.state.commentView,
              backening: this.state.backening,
              data: this.state.commentData,
              text: this.state.commentText,
            }}
          />
        ) : (
          <LoadingIndicator />
        )}
      </View>
    );
  }
}

const styles = globalStyle;
