import React from 'react';
import { Badge } from 'react-bootstrap';

export function OKView({ value }: { value: boolean }) {
    return <Badge bg={value ? 'success' : 'danger'}>{value ? 'OK' : 'Error'}</Badge>;
}
