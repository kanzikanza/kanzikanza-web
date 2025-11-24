'use client'
import { BaseNotiModal } from "@/component/Modal/BaseModal"
import axios from "axios";
import { useEffect, useState } from "react";

export default function TestResultModalPage() {
    const title: string = "시험 끝!"
    const subtitle : string = "() 일 연속 칸지칸자 공부중"
    const [open, setOpen] = useState<boolean>(false);
    // 여기서 어마무시한 갱신확인

    return (
        <BaseNotiModal
            title={title}
            subtitle={subtitle}
            open={open}
            setOpen={setOpen}
        />
    )
}