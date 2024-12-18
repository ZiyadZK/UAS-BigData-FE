'use client'

import { CustomTabItem, CustomTabs } from "@/components/CustomTabs";
import DropdownMenu from "@/components/DropdownMenu";
import { nunito } from "@/libs/fonts";
import { AutoGraph, Check, Class, Close, CurrencyPound, Info, Money, Person2, Refresh, Restore, Score, Search, Summarize, Warning } from "@mui/icons-material";
import { Autocomplete, Button, InputAdornment, LinearProgress, TextField } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Home() {

  const router = useRouter()

  const [prediction, setPrediction] = useState({
    status: '',
    survived: false,
    probabilities: {
      survived: 0,
      not_survived: 0
    },
    alasan: ''
  })

  const [form, setForm] = useState({
    model: null,
    'Sex': null,
    'Age': 0,
    'Passenger Class': null,
    'No of Siblings or Spouses on Board': 0,
    'No of Parents or Children on Board': 0,
    'Port of Embarkation': null,
    'Passenger Fare': 0.0
  })

  const [visualisasi, setVisualisasi] = useState({
    data_summary: {
      data: null,
      status: ''
    },

  })

  const aksi = {
    form: {
      set: (column, value) => {
        setForm(state => ({
          ...state,
          [column]: value
        }))
      },
      submit: async (e) => {
        try {

          e.preventDefault()

          setPrediction(state => ({
            ...state,
            status: 'loading'
          }))

          const payload = {
            "Sex": parseInt( form['Sex']['value']),
              "Age": parseInt(form['Age']),
              "Passenger Class": parseInt(form['Passenger Class']['value']),
              "No of Parents or Children on Board": parseInt(form['No of Parents or Children on Board']),
              "No of Siblings or Spouses on Board": parseInt(form['No of Siblings or Spouses on Board']),
              "Port of Embarkation": parseInt(form['Port of Embarkation']['value']),
              "Passenger Fare": parseFloat(form['Passenger Fare'])
          }

          console.log(payload)

          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/predict`, payload)

          setPrediction(state => ({
            ...state,
            status: 'fetched',
            survived: response.data.survived,
            probabilities: response.data.probabilities,
            alasan: response.data.alasan
          }))
        } catch (error) {
          if(error instanceof Error) {
            console.log(error)
            Swal.fire({
              title: 'Error',
              text: error.message
            })
          }else if(error instanceof AxiosError) {
            console.log(error.response)
            Swal.fire({
              title: 'Error',
              text: error.response.data?.error
            })
          }

          setPrediction(state => ({
            ...state,
            status: 'error'
          }))          
        }
      }
    }
  }

  return (
    <div className={`flex justify-center  min-h-screen w-full bg-zinc-50 ${nunito.className} text-zinc-700 p-5`}>
      <div className="max-w-screen-lg w-full">
        <form onSubmit={(e) => aksi.form.submit(e)} className="p-5 rounded-xl bg-white shadow-xl">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <Autocomplete 
                fullWidth
                options={[
                  {
                    label: 'Female / Perempuan', value: 1
                  },
                  {
                    label: 'Male / Laki-laki', value: 0
                  }
                ]}
                getOptionLabel={(v) => v['label']}
                value={form['Sex']}
                onChange={(e, value) => aksi.form.set('Sex', value)}
                renderInput={(params) => <TextField {...params} required label="Sex / Gender" />}
              />
              <div className="grid grid-cols-2 gap-5">
                <TextField 
                  required
                  type="number"
                  label="Age / Umur"
                  autoComplete="off"
                  value={form['Age']}
                  onChange={(e) => aksi.form.set('Age', e.target.value)}
                />
                <Autocomplete 
                  fullWidth
                  getOptionLabel={(v) => v['label']}
                  options={[
                    {
                      label: 'First', value: 1
                    },
                    {
                      label: 'Second', value: 2
                    },
                    {
                      label: 'Third', value: 3
                    }
                  ]}
                  value={form['Passenger Class']}
                  onChange={(e, value) => aksi.form.set('Passenger Class', value)}
                  renderInput={(params) => <TextField {...params} required label="Passenger Class" />}
                  
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <TextField 
                required
                type="number"
                label="Jumlah Pasangan atau Saudara Kandung"
                autoComplete="off"
                value={form['No of Siblings or Spouses on Board']}
                onChange={(e) => aksi.form.set('No of Siblings or Spouses on Board', e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment>
                        <Person2 fontSize="small" />
                      </InputAdornment>
                    )
                  }
                }}
              />
              <TextField 
                required
                type="number"
                label="Jumlah Orang tua kandung atau Anak-anak"
                autoComplete="off"
                value={form['No of Parents or Children on Board']}
                onChange={(e) => aksi.form.set('No of Parents or Children on Board', e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment>
                        <Person2 fontSize="small" />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Autocomplete 
                fullWidth
                getOptionLabel={(v) => v['label']}
                options={[
                  {
                    label: 'Southampton', value: 1
                  },
                  {
                    label: 'Cherbourg', value: 2
                  },
                  {
                    label: 'Queenstown', value: 3
                  }
                ]}
                value={form['Port of Embarkation']}
                onChange={(e, value) => aksi.form.set('Port of Embarkation', value)}
                renderInput={(params) => <TextField {...params} required label="Port of Embarkation" />}
              />
              <TextField 
                required
                type="number"
                label="Passenger Fare"
                autoComplete="off"
                value={form['Passenger Fare']}
                onChange={(e) => aksi.form.set('Passenger Fare', e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyPound fontSize="small" />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between gap-5">
              <Button disabled={prediction.status === 'loading'} type="submit" variant="contained" startIcon={<Search fontSize="small" />}>
                <div className={`${nunito.className}`}>
                  Predict
                </div>
              </Button>
              <DropdownMenu 
                buttonComponent={(
                  <Button variant="text" startIcon={<Info fontSize="small" />} sx={{ borderRadius: 999, px: 2}}>
                    <div className={`${nunito.className}`}>
                      detail
                    </div>
                  </Button>
                )}
                menuItems={[
                  {
                    label: 'Correlation Heatmap',
                    onClick: () => window.open(`${process.env.NEXT_PUBLIC_API_URL}/data/correlation-heatmap`, '_blank'),
                    icon: <AutoGraph fontSize="small" color="primary" />
                  },
                  {
                    label: 'Data Summary',
                    onClick: () => window.open(`${process.env.NEXT_PUBLIC_API_URL}/data-summary`, '_blank'),
                    icon: <Summarize fontSize="small" color="primary" />
                  },
                  {
                    label: 'Fare Distribution',
                    onClick: () => window.open(`${process.env.NEXT_PUBLIC_API_URL}/data/fare-distribution`, '_blank'),
                    icon: <Money fontSize="small" color="primary" />
                  }
                ]}
              >
                <p className="text-xs">
                  Anda akan dibawa ke halaman baru
                </p>
              </DropdownMenu>
            </div>
            <hr />
            <div className="">
              <div className="flex items-center gap-5">
                <Score />
                Hasil Prediksi
              </div>
              {prediction.status === 'loading' && (
                <LinearProgress />
              )}
              {prediction.status === 'fetched' && (
                <>
                  {prediction.survived ? (
                    <div className="flex justify-center items-center gap-5">
                      <Check fontSize="large" color="success" />
                      <p className="text-4xl text-green-600">
                        Selamat
                      </p>
                    </div>
                  ):(
                    <div className="flex justify-center items-center gap-5">
                      <Close fontSize="large" color="error" />
                      <p className="text-4xl text-red-600">
                        Tidak Selamat
                      </p>
                    </div>
                  )}
                  {prediction.alasan && (
                    <div className="flex justify-center items-center">
                      <div className="px-3 py-2 rounded-xl bg-zinc-50">
                        <p className="text-center">
                          {prediction.alasan}
                        </p>
                      </div>
                    </div>
                  )}
                  <hr className="my-5" />
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-3 flex items-center gap-5 justify-between">
                        <div className="">
                          Selamat
                        </div>
                        <div className="">
                          {prediction.probabilities.survived}%
                        </div>
                      </div>
                      <div className="col-span-9 flex items-center">
                        <div className="w-full">
                          <LinearProgress variant="determinate" value={prediction.probabilities.survived} color="success" />
                          <LinearProgress variant="determinate" value={prediction.probabilities.survived} color="success" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-3 flex items-center gap-5 justify-between">
                        <div className="">
                          Tidak Selamat
                        </div>
                        <div className="">
                          {prediction.probabilities.not_survived}%
                        </div>
                      </div>
                      <div className="col-span-9 flex items-center">
                        <div className="w-full">
                          <LinearProgress variant="determinate" value={prediction.probabilities.not_survived} color="error" />
                          <LinearProgress variant="determinate" value={prediction.probabilities.not_survived} color="error" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {prediction.status === 'error' && (
                <div className="flex justify-center items-center gap-5">
                  <Warning fontSize="large" color="warning" />
                  <p className="text-4xl text-orange-600">
                    Error
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
