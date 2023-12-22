import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import customFetch from '../../utils/axios'


// filter feature
const initialFiltersState = {
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}

const initialState = {
  isLoading: false,
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  ...initialFiltersState,
}




export const getAllJobs = createAsyncThunk(
  'allJobs_getJobs',
  async(_,thunkAPI)=>{
    let url = `/jobs`

    try {
      const resp = await customFetch.get(url, {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        },
      })
      return resp.data // return all jobs data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)
export const deleteJob = createAsyncThunk(
  'job_deleteJob',
    async(id,thunkAPI)=>{
      try {
        //Delete a data
        const resp = await customFetch.delete(`/jobs/${id}`, {
          headers: {
            authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
          },
        })
        //Refetch the all the data
        thunkAPI.dispatch(getAllJobs())
        return resp.data.msg
      } catch (error) {
        thunkAPI.dispatch(hideLoading())
        return thunkAPI.rejectWithValue(error.response.data.msg)
      }
    }
)





const allJobSlice = createSlice({
  name:'allJobs',
  initialState,
  reducers:{
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllJobs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllJobs.fulfilled, (state,{payload}) => {
        state.isLoading = false
        state.jobs = payload.jobs
      })
      .addCase(getAllJobs.rejected, (state, {payload}) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(deleteJob.fulfilled, (state, {payload}) => {
        state.isLoading = false
        toast.success(payload)
      })
      .addCase(deleteJob.rejected, (state, {payload}) => {
        state.isLoading = false
        toast.error(payload)
      })
},
})

export const {showLoading,hideLoading} = allJobSlice.actions

export default allJobSlice.reducer
