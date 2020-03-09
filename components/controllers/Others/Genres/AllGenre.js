import React from 'react';
import {View, Text, BackHandler, AsyncStorage} from 'react-native';
import GenreListScreen from './../../../Views/Others/GenreListScreen';
import {mobileApi} from './../../../systems/config';
import LoadingIndicator from './../../../Views/components/LoadingIndicator';
import EmptyState from './../../../Views/components/EmptyState';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StackActions, NavigationActions} from 'react-navigation';
import {Database} from '../../../systems/database';

export default class AllGenre extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      empty: false,
      other: false,
      bookmark: [],
      sort: null,
      page: 1,
      loadingPage: false,
      loadingAgain : true
    };

    this.method = {
      bookmarkFunc: this._bookmarkFunc.bind(this),
      sortBy: this._sortBy.bind(this),
      isCloseToBottom: this.isCloseToBottom.bind(this),
      loadMore : this._loadMore.bind(this)
    };
  }

  async _sortBy(val) {
    this.setState(
      {
        sort: val,
        page : 1
      },
      async () => {
        await Database.GET('genre/' + this.endGenre + `/${val}/${this.state.page}`).then(() => {
          if (Database.data) {
            this.setState(
              {
                data: Database.data.data,
              },
              async () => {
                await this._getBookmarkData();
              },
            );
          } else {
            this.setState(
              {
                empty: true,
              },
              async () => {
                await this._getBookmarkData();
              },
            );
          }
        });
      },
    );
  }

  async componentDidMount() {
    this._getListMangaByGenre();
  }

  async _getBookmarkData() {
    let data = JSON.parse(await AsyncStorage.getItem('bookmark'));
    data = data.map(e => e.id_manga);

    this.setState({
      loading: false,
      bookmark: data,
    });
  }

  _getListMangaByGenre = async () => {
    let endGenre = undefined;
    if (this.props.injectGenre !== undefined) {
      endGenre = this.props.injectGenre;
    } else if (this.props.navigation !== undefined) {
      endGenre = this.props.navigation.state.params.genre;
    } else {
      endGenre = this.props.genre;
    }

    this.endGenre = endGenre;

    // inject status
    let injectStatus = false;
    let injectAnother = undefined;
    if (this.props.injectGenre != undefined) {
      injectStatus = true;
      injectAnother = true;
      this.injectAnother = injectAnother;
    } else {
      if (typeof this.props.navigation != undefined) {
        try {
          injectStatus = this.props.navigation.state.params.inject;
        } catch (err) {
          // do nothing
        }
      }
    }

    this.injectStatus = injectStatus;

    // get request
    Database.GET(
      'genre/' +
        endGenre.toLowerCase() +
        `/${this.endGenre.toLowerCase() == 'all' ? 'likes/desc' : 'name/asc'}/${
          this.state.page
        }`,
    ).then(() => {
      if (Database.data.data.length != 0) {
        this.setState(
          {
            data: [...this.state.data, ...Database.data.data],
            sort:
              this.endGenre.toLowerCase() == 'all' ? 'likes/desc' : 'name/asc',
          },
          async () => {
            await this._getBookmarkData();
          },
        );
      } else {
        this.setState(
          {
            empty: true,
          },
          async () => {
            await this._getBookmarkData();
          },
        );
      }
    });
  };

  _bookmarkFunc = async item => {
    await AsyncStorage.getItem('bookmark')
      .then(res => JSON.parse(res))
      .then(async res => {
        let realData = null;
        if (res != null) {
          let data;
          let found = false;
          let foundId = null;
          let foundData = null;

          res.forEach(async e => {
            if (e.id_manga == item.id_manga) {
              found = true;
            }
          });

          if (found) {
            // hapus data
            data = res.filter(e => e.id_manga != item.id_manga);
          } else {
            // tambah data

            data = [...res, item];
          }

          realData = data;
          await AsyncStorage.setItem('bookmark', JSON.stringify(data));
        } else {
          let data = [];
          data.push(item);
          realData = data;

          await AsyncStorage.setItem('bookmark', JSON.stringify(data));
        }

        await this._postReaction(item.id_manga, 'bookmark');
        this.setState({
          bookmark: realData.map(e => e.id_manga),
        });
      });
  };

  _postReaction = async (idManga, reaction) => {
    let userId;
    await AsyncStorage.getItem('userId').then(res => (userId = res));

    Database.POST(`user/${reaction == 'like' ? 'like' : 'bookmark'}`, {
      userId: userId,
      idManga: idManga,
    }).then(res => {
      console.log(res);
    });
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  _loadMore() {
    this.setState(
      {
        loadingPage: this.state.loadingAgain ? true : false,
        page: this.state.page + 1,
      },
      async () => {
        await Database.GET(
          'genre/' +
            this.endGenre.toLowerCase() +
            `/${
              this.endGenre.toLowerCase() == 'all' ? 'likes/desc' : 'name/asc'
            }/${this.state.page}`,
        ).then(() => {
            
                this.setState(
                  {
                    data: [...this.state.data, ...Database.data.data],
                    sort:
                      this.endGenre.toLowerCase() == 'all'
                        ? 'likes/desc'
                        : 'name/asc',
                    loadingPage: false,
                    loadingAgain : Database.data.data.length < 2 ? false : true
                  },
                  async () => {
                    await this._getBookmarkData();
                  },
                );
          
        });
      },
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.loading == true ? (
          <LoadingIndicator />
        ) : this.state.empty == false ? (
          <GenreListScreen
            navigation={this.props.navigation}
            inject={this.injectStatus}
            injectAnother={this.injectAnother}
            navigator={this.props.navigator}
            genre={this.endGenre}
            data={this.state.data}
            other={this.state.other}
            backprop={this.props.backprop != undefined ? true : false}
            bookmark={this.state.bookmark}
            method={this.method}
            sort={this.state.sort}
            loading={this.state.loadingPage}
          />
        ) : (
          <EmptyState />
        )}
      </View>
    );
  }
}
