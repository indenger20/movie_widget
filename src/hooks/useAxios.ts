import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios, { AxiosInstance } from 'axios';

interface IProps {
  baseURL: string;
  MOVIE_API_KEY: string;
}

export type API = AxiosInstance;
