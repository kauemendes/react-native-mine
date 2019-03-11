import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert} from 'react-native';
import params from './src/Params'
import MineField from './src/components/MineField'
import Header from './src/components/Header'
import LevelSelection from './src/screens/LevelSelection'

import {
  invertFlag,
  cloneBoard,
  openField,
  hasExplosion,
  wonGame,
  showMines,
  createMinedBoard, 
  flahsUsed
} from './src/functions'

const board = createMinedBoard()

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return Math.ceil(cols * rows * params.difficultLevel)
  }

  createState = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return {
      board: createMinedBoard(cols, rows, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false
    }
  }

  openField = (row, column) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hasExplosion(board)
    const won = wonGame(board)

    if (lost) {
      showMines(board)
      Alert.alert('Perdeeeeu!', 'Tente de novamente')
    }

    if (won) {
      Alert.alert('Venceeeuuu!', 'Bora de novo!')
    }

    this.setState({board, lost, won})
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if (won) {
      Alert.alert('Venceeeuuu!', 'Bora de novo!')
    }

    this.setState({board, won})
  }

  onLevelSelected = level => {
    params.difficultLevel = level
    this.setState(this.createState())
  }

  render() {
    return (
      <View style={styles.container}>
        <LevelSelection isVisible={this.state.showLevelSelection} 
          onLevelSelected={this.onLevelSelected}
          onCancel={() => this.setState({showLevelSelection: false})} />
        <Header flagsLeft={this.minesAmount() - flahsUsed(this.state.board)} 
          onNewGame={() => this.setState(this.createState())} 
          onFlagPress={() => this.setState({showLevelSelection: true})} />
        <View style={styles.board}>
          <MineField board={this.state.board} onOpenField={this.openField} onSelectField={this.onSelectField} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
});
