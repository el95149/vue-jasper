<template>
    <div>
        <el-form ref="reportsForm" :rules="rules" :model="criteria" v-loading="loading">
            <el-form-item :label="$t('jasper.report.self')" prop="report">
                <el-select v-model="criteria.report" value-key="uri"
                           :placeholder="$t('jasper.report.placeholder')" :clearable="true"
                           @change="getReportControls" @clear="clearReport">
                    <i slot="prefix" class="el-input__icon el-icon-data-analysis"></i>
                    <el-option
                            v-for="report in reports"
                            :key="report.uri"
                            :label="report.label"
                            :value="report">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-alert
                    :title="criteria.report.label"
                    :description="criteria.report.description"
                    type="info" v-if="criteria.report" show-icon :closable="false" style="margin-bottom: 10px"/>
            <template v-for="inputControl in criteria.inputControls">
                <el-form-item :label="inputControl.label"
                              :key="inputControl.uri" :prop="getPropName(inputControl)">
                    <component :name="inputControl.id" :key="inputControl.id" :is="getControlType(inputControl)"
                               v-bind="getControlProps(inputControl)"
                               v-model="inputControl.state.value"/>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="previewReport">
                    {{$t('jasper.report.preview')}}
                </el-button>
                <el-dropdown @command="generateReport" style="margin-right: 10px">
                    <el-button type="success" icon="el-icon-download">
                        {{$t('jasper.report.generate')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="type.value" v-for="type in types" :key="type.value">
                            {{type.label}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="info" icon="el-icon-delete" @click="clearReport">
                    {{$t('jasper.report.clear')}}
                </el-button>
            </el-form-item>
        </el-form>
        <el-dialog type="warning" :title="$t('jasper.report.preview')" :visible="isPreview" :modal="true"
                   :close-on-click-modal="false" :close-on-press-escape="true" :modal-append-to-body="false"
                   :show-close="true" width="90%" top="50px"
                   @close="clearPreview">
            <el-scrollbar :native="false">
                <div v-html="html" style="min-height: 800px;height: 900px;max-height: 1000px;"></div>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>
<script src="./VueJasperVM.js"/>
