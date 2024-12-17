'use client'

import { nunito } from "@/libs/fonts";
import { Check, Close, Refresh, Restore, Score, Search, Warning } from "@mui/icons-material";
import { Autocomplete, Button, LinearProgress, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Home() {

  const [prediction, setPrediction] = useState({
    status: '',
    survived: false
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

          const response = await axios.post(`https://uas-bigdata-production.up.railway.app/predict?model=${form.model['value']}`, {
              "Sex": parseInt( form['Sex']['value']),
              "Age": parseInt(form['Age']),
              "Passenger Class": parseInt(form['Passenger Class']['value']),
              "No of Parents or Children on Board": parseInt(form['No of Parents or Children on Board']),
              "No of Siblings or Spouses on Board": parseInt(form['No of Siblings or Spouses on Board']),
              "Port of Embarkation": parseInt(form['Port of Embarkation']['value']),
              "Passenger Fare": parseFloat(form['Passenger Fare'])
          })

          setPrediction(state => ({
            ...state,
            status: 'fetched',
            survived: response.data.survived
          }))
        } catch (error) {
          if(error instanceof Error) {
            Swal.fire({
              title: 'Error',
              text: error.message
            })
          }else if(error instanceof AxiosError) {
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
    <div className={`flex justify-center items-center min-h-screen w-full bg-zinc-50 ${nunito.className} text-zinc-700`}>
      <div className="max-w-screen-lg w-full">
        <form onSubmit={(e) => aksi.form.submit(e)} className="p-5 rounded-xl bg-white shadow-xl">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-5">
              <div className="flex items-center">
                Model
              </div>
              <div className="flex items-center col-span-2">
                <Autocomplete
                  disablePortal
                  fullWidth
                  options={[
                    {
                      label: 'Gaussian Naive Bayes', value: 'gaussiannb_model'
                    },
                    {
                      label: 'Logistic Regression', value: 'logistic_regression_model'
                    },
                    {
                      label: 'SVM Model', value: 'svm_model'
                    },
                    {
                      label: 'k-NN Model', value: 'knn_model'
                    }
                  ]}
                  getOptionLabel={(v) => v['label']}
                  value={form['model']}
                  onChange={(e, value) => aksi.form.set('model', value)}
                  renderInput={(params) => <TextField {...params} required label="Pilih Model" />}
                />
              </div>
            </div>
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
              />
              <TextField 
                required
                type="number"
                label="Jumlah Orang tua kandung atau Anak-anak"
                autoComplete="off"
                value={form['No of Parents or Children on Board']}
                onChange={(e) => aksi.form.set('No of Parents or Children on Board', e.target.value)}
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
              />
            </div>
            <div className="flex items-center gap-5">
              <Button disabled={prediction.status === 'fetched' && prediction.status === 'error' } type="submit" variant="contained" startIcon={<Search fontSize="small" />}>
                <div className={`${nunito.className}`}>
                  Predict
                </div>
              </Button>
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
