import '@models/train.course'
import '@models/train.center'
import { getModelForClass } from '@typegoose/typegoose'
import { TrainCourse } from '@models/train.course'
import { TrainCenter } from '@models/train.center'

/* center <-> course 간의 circular dependency를 해결하기 위해서
 ordering 목적으로 central processing file을 추가하였습니다.
 */
export const TrainCourseModel = getModelForClass(TrainCourse)
export const TrainCenterModel = getModelForClass(TrainCenter)
