import axios from 'axios'
import { filter } from 'lodash'
import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, ScrollView } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { connect } from 'react-redux'
import { BASE_URL } from '../consts'
import Footer from '../layout/Footer'
import HeaderBack from '../layout/HeaderBack'
import Loading from '../layout/Loading'
import { User } from '../_redux/reducers/types'
import styles from './SubjectStyles'
import Toast from 'react-native-simple-toast'
import { moderateScale } from 'react-native-size-matters'

type MyProps = {
  navigation: any
  token: string
  route: any
  user: User
}

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
}

const Review = ({ navigation, token, route, user }: MyProps) => {
  const { subId, chapterId, totalQues } = route.params
  const [loading, setLoading] = useState(true)
  const [marks, setMarks] = useState([])
  const [chartData, setChartData] = useState([])
  const [totalMarks, setTotalMarks] = useState(0)

  useEffect(() => {
    getMarks()
  }, [])

  const getMarks = () => {
    axios
      .get(
        `${BASE_URL}/marks/${user.user_id}/${subId}/${chapterId}?api_token=${token}`,
      )
      .then(
        (res) => {
          if (res.data.success) {
            let pos_marks = 0
            let neg_marks = 0

            setMarks(res.data.result)
            const correct = filter(res.data.result, (result) => {
              return result.options_id === result.correct_ans
            })
            const wrong = filter(res.data.result, (result) => {
              return result.options_id !== result.correct_ans
            })
            correct.forEach((result: { calculation_id: number }) => {
              if (result.calculation_id == 1) pos_marks += 1
              else if (result.calculation_id == 2) pos_marks += 4
              else if (result.calculation_id == 3) pos_marks += 2
            })
            wrong.forEach((result: { calculation_id: number }) => {
              if (result.calculation_id == 1) neg_marks -= 0
              else if (result.calculation_id == 2) neg_marks -= 1
              else if (result.calculation_id == 3) neg_marks -= 0.66
            })
            setChartData([
              {
                name: 'Correct Answers',
                population: correct.length,
                color: 'green',
                legendFontColor: '#7F7F7F',
                legendFontSize: moderateScale(15),
              },
              {
                name: 'Wrong Answers',
                population: wrong.length,
                color: '#F00',
                legendFontColor: '#7F7F7F',
                legendFontSize: moderateScale(15),
              },
            ])
            setTotalMarks(pos_marks - neg_marks)
          }

          setLoading(false)
        },
        (error) => {
          setLoading(false)
          Toast.show('Network error. Tryagain.', Toast.LONG)
        },
      )
  }

  return (
    <View style={styles.content}>
      <Loading loading={loading} text="Loading review. Please wait." />
      <HeaderBack navigation={navigation} heading="Result" />
      <ScrollView>
        {!loading && (
          <View style={styles.contents}>
            <View style={styles.alignCenter}>
              <PieChart
                data={chartData}
                width={Dimensions.get('window').width}
                height={150}
                chartConfig={chartConfig}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft="-35"
                center={[50, -10]}
                absolute
              />
            </View>
            <View style={[styles.marks, styles.bgTheme]}>
              <Text style={styles.textBig}>Total Marks</Text>
              <Text style={[styles.textBig, styles.mbmarks]}>{totalMarks}</Text>
            </View>
            <Text style={styles.mt10}>Total Questions: {totalQues}</Text>
            <Text>Attended Questions: {marks.length}</Text>
            <Text>Unattended Questions: {totalQues - marks.length}</Text>
          </View>
        )}
      </ScrollView>
      <Footer navigation={navigation} page={`Question`} />
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer.user,
  token: state.authReducer.token,
})

export default connect(mapStateToProps)(Review)
