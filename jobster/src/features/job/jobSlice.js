import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import customFetch from '../../utils/axios'
import { getFromLocalStorage } from '../../utils/localStorage'
import { logoutUser } from '../user/userSlice'

const initialState = {
  isLoading: false,
  position: '',
  company: '',
  jobLocation: '',
  // ex
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  // default value
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  isEditing: false,
  editJobId: '',
}


export const createJob = createAsyncThunk(
  'job_createJob',
  async (job, thunkAPI ) =>{
    try {
      const resp = await customFetch.post('/jobs', job, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        },
      })
      thunkAPI.dispatch(clearValues())
      return resp.data
    } catch (error) {
      if(error.response.status = 401){
        /** */
        if (error.response.status === 401) {
          thunkAPI.dispatch(logoutUser());
          return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
        }
        return thunkAPI.rejectWithValue(error.response.data.msg);
      }
    }
  }
)



const jobSlice = createSlice({
    name:'job',
    initialState,
    reducers:{
      handleChange:(state,{payload:{name,value}})=>{
        state[name] = value
      },
      clearValues:()=>{
        // what ever is returned from the reducer is the new state as a hole
        return {
          ...initialState,
          // save the location from the profile
          jobLocation: getFromLocalStorage()?.location || '',

        }
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(createJob.pending, (state) => {
          state.isLoading = true
        })
        .addCase(createJob.fulfilled, (state) => {
          state.isLoading = false
          toast.success('job created')
        })
        .addCase(createJob.rejected, (state, {payload}) => {
          state.isLoading = false
          // error from 
          /**
           *return thunkAPI.rejectWithValue(error.response.data.msg);
           */
          toast.error(payload)
        })
  },
})


export const {handleChange,clearValues} = jobSlice.actions

export default jobSlice.reducer